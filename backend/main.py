import boto3
import base64
from dotenv import load_dotenv
import json
from botocore.exceptions import ClientError
from PIL import Image
import os
from textractor import Textractor
from textractor.data.constants import TextractFeatures
from http.server import HTTPServer
from handler import Handler

load_dotenv()


def extract_from_image(image_path):
    image = Image.open(image_path).convert("RGB")
    region_name = os.environ.get("AWS_REGION") or "us-west-2"
    extractor = Textractor(region_name=region_name)
    document = extractor.analyze_document(
        file_source=image,
        features=[
            TextractFeatures.LAYOUT,
            TextractFeatures.TABLES,
            TextractFeatures.FORMS,
            TextractFeatures.SIGNATURES,
        ],
        save_image=True,
    )
    return document


def invoke_model(model_id, user_prompt, image_path):
    try:
        with open(image_path, "rb") as image_file:
            image_data = image_file.read()
            base64_image = base64.b64encode(image_data).decode("utf-8")

        client = boto3.client("bedrock-runtime")
        native_request = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 512,
            "temperature": 0.5,
            "top_p": 0.9,
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": user_prompt},
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": "image/png",
                                "data": base64_image,
                            },
                        },
                    ],
                }
            ],
        }

        request = json.dumps(native_request)

        response = client.invoke_model(modelId=model_id, body=request)
        reponse_body = json.loads(response["body"].read())
        return " ".join(content["text"] for content in reponse_body.get("content", []))

    except ClientError as e:
        print(f"ClientError invoking model '{model_id}': {e}")
        return None
    except Exception as e:
        print(f"Unexpected error invoking model '{model_id}': {e}")
        return None


def load_markdown_s3(file_name):
    region_name = os.environ.get("AWS_REGION") or "us-west-2"
    s3 = boto3.client("s3", region_name=region_name)
    bucket_name = "risk-document-lenders"
    file_path = f"markdown/{file_name}"
    response = s3.get_object(Bucket=bucket_name, Key=file_path)
    return response["Body"].read().decode("utf-8")


def run_server():
    HOST_NAME = os.environ.get("HOST_NAME") or "localhost"
    PORT_NUMBER = os.environ.get("PORT_NUMBER") or 5143
    print(f"Starting server on {HOST_NAME}:{PORT_NUMBER}")
    server_address = (HOST_NAME, int(PORT_NUMBER))
    httpd = HTTPServer(server_address, Handler)
    print("Server running...")
    httpd.serve_forever()


if __name__ == "__main__":
    run_server()
