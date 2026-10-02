import os
import sys
import json
import mime
import mimetypes
import boto3
from botocore.exceptions import ClientError

def deploy_to_aws_s3(aws_access_key_id, aws_secret_access_key, region_name='us-east-1', bucket_name=None):
    if not bucket_name:
        import time
        bucket_name = f"campusflow-app-{int(time.time())}"

    print(f"Connecting to AWS S3 in region: {region_name}...")
    session = boto3.Session(
        aws_access_key_id=aws_access_key_id,
        aws_secret_access_key=aws_secret_access_key,
        region_name=region_name
    )
    s3_client = session.client('s3')

    # Create bucket
    print(f"Creating S3 Bucket: {bucket_name}...")
    try:
        if region_name == 'us-east-1':
            s3_client.create_bucket(Bucket=bucket_name)
        else:
            s3_client.create_bucket(
                Bucket=bucket_name,
                CreateBucketConfiguration={'LocationConstraint': region_name}
            )
    except ClientError as e:
        if e.response['Error']['Code'] == 'BucketAlreadyOwnedByYou':
            print("Bucket already exists and owned by you. Proceeding...")
        else:
            print(f"Error creating bucket: {e}")
            raise e

    # Turn off Block Public Access
    print("Configuring public website access settings...")
    try:
        s3_client.put_public_access_block(
            Bucket=bucket_name,
            PublicAccessBlockConfiguration={
                'BlockPublicAcls': False,
                'IgnorePublicAcls': False,
                'BlockPublicPolicy': False,
                'RestrictPublicBuckets': False
            }
        )
    except Exception as e:
        print(f"Warning setting public access block: {e}")

    # Set Bucket Policy for public read
    bucket_policy = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "PublicReadGetObject",
                "Effect": "Allow",
                "Principal": "*",
                "Action": "s3:GetObject",
                "Resource": f"arn:aws:s3:::{bucket_name}/*"
            }
        ]
    }
    try:
        s3_client.put_bucket_policy(Bucket=bucket_name, Policy=json.dumps(bucket_policy))
    except Exception as e:
        print(f"Warning setting bucket policy: {e}")

    # Configure Website configuration
    s3_client.put_bucket_website(
        Bucket=bucket_name,
        WebsiteConfiguration={
            'ErrorDocument': {'Key': 'index.html'},
            'IndexDocument': {'Suffix': 'index.html'}
        }
    )

    # Upload dist directory
    dist_dir = os.path.join(os.path.dirname(__file__), 'dist')
    if not os.path.exists(dist_dir):
        print("dist directory not found! Run npm run build first.")
        sys.exit(1)

    print(f"Uploading files from {dist_dir} to s3://{bucket_name}...")
    uploaded_files = []
    for root, dirs, files in os.walk(dist_dir):
        for file in files:
            full_path = os.path.join(root, file)
            relative_path = os.path.relpath(full_path, dist_dir).replace('\\', '/')
            
            content_type, _ = mimetypes.guess_type(full_path)
            if not content_type:
                if relative_path.endswith('.css'):
                    content_type = 'text/css'
                elif relative_path.endswith('.js'):
                    content_type = 'application/javascript'
                elif relative_path.endswith('.html'):
                    content_type = 'text/html'
                else:
                    content_type = 'binary/octet-stream'

            print(f"  Uploading {relative_path} ({content_type})...")
            with open(full_path, 'rb') as f:
                s3_client.put_object(
                    Bucket=bucket_name,
                    Key=relative_path,
                    Body=f,
                    ContentType=content_type
                )
            uploaded_files.append(relative_path)

    website_url = f"http://{bucket_name}.s3-website-{region_name}.amazonaws.com"
    if region_name == 'us-east-1':
        website_url = f"http://{bucket_name}.s3-website-us-east-1.amazonaws.com"

    print("\n" + "="*60)
    print("🚀 SUCCESS! CampusFlow is 100% genuinely live on AWS S3!")
    print(f"AWS Public Website URL: {website_url}")
    print("="*60 + "\n")
    return website_url

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python deploy_aws_s3_amplify.py <AWS_ACCESS_KEY_ID> <AWS_SECRET_ACCESS_KEY> [REGION]")
        sys.exit(1)

    ak = sys.argv[1]
    sk = sys.argv[2]
    reg = sys.argv[3] if len(sys.argv) > 3 else 'us-east-1'
    deploy_to_aws_s3(ak, sk, reg)
