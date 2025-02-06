import os
import random
import pymupdf4llm
import boto3
from botocore.exceptions import ClientError
import json


input_file = "input.pdf"

SYSTEM_PROMPT = """
You are a credit risk analyst. You will be provided with a credit risk policy and an application.
Your job is to rate the credit risk of the applicant based on the policy. You should
rate the credit risk on a scale from 1 to 5, where 1 is the lowest risk and 5 is the
highest risk. You should also provide a brief assessment of the applicant's
creditworthiness, and suggest remedies if the credit risk is high. Stick to the facts
available in the credit risk policy policy and application."""


def get_results(policy, application, credit_score):
    try:
        client = boto3.client("bedrock-runtime")
        native_request = {
            "system": SYSTEM_PROMPT,
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 4096,
            "temperature": 0.5,
            "top_p": 0.9,
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": f"""
Read the credit risk policy in the < POLICY> tag, and the application in the < APPLICATION> tag below.
‹POLICY>
{policy}
</POLICY>
<APPLICATION>
{application}
</APPLICATION>
Using the < POLICY> document, rate the credit risk on a scale from 1 to 5 when the
applicant's credit score is {credit_score}:
1. Risk-free
2. Low risk
3. Medium risk
4. High risk
5. Unacceptable risk
return a json with the following keys:
- SCORE: the credit risk score calculated above
- ASSESSMENT: credit worthiness assessment of 200 words or less (5-6 bullet points).
- REMEDIES: a list of sugestions to improve the credit risk rating for future applications - only write this if the SCORE is 3 or higher, and leave it empty if it's 1 or 2.
do not write any commentary before or after the json object.
""",
                        },
                    ],
                }
            ],
        }

        request = json.dumps(native_request)

        response = client.invoke_model(
            modelId="anthropic.claude-3-5-sonnet-20241022-v2:0", body=request
        )
        reponse_body = json.loads(response["body"].read())
        return reponse_body["content"][0]["text"]

    except ClientError as e:
        print(
            f"ClientError invoking model 'anthropic.claude-3-5-sonnet-20241022-v2:0': {e}"
        )
        return ""
    except Exception as e:
        print(
            f"Unexpected error invoking model 'anthropic.claude-3-5-sonnet-20241022-v2:0': {e}"
        )
        return ""


def get_credit_score():
    # TODO: replace with actual credit scoring logic
    return random.randint(650, 800)


def to_markdown(file_name):
    md_text = pymupdf4llm.to_markdown(f"./{file_name}")
    return md_text


def load_markdown_s3(file_name):
    region_name = "us-west-2"
    s3 = boto3.client("s3", region_name=region_name)
    bucket_name = "risk-document-markdown"
    file_path = f"{file_name}.txt"
    response = s3.get_object(Bucket=bucket_name, Key=file_path)
    return response["Body"].read().decode("utf-8")


def main(body_data, file):
    policy_file = body_data["policy"]
    filename = file["filename"]

    policy = load_markdown_s3(policy_file)

    with open(filename, "wb") as pdf_file:
        pdf_file.write(file["content"])

    md_text = to_markdown(filename)

    result = get_results(policy, md_text, get_credit_score())

    os.remove(filename)
    return result.replace("\n", "")
