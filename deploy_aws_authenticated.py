import os
import sys
import json
import mimetypes
import boto3
from botocore.exceptions import ClientError

def main():
    bucket_name = "campusflow-zero-to-shipped-136060259689"
    region = "us-east-1"

    print(f"Connecting to AWS with authenticated CLI session in {region}...")
    session = boto3.Session(region_name=region)
    s3_client = session.client('s3')

    print(f"Ensuring S3 bucket exists: {bucket_name}...")
    try:
        s3_client.create_bucket(Bucket=bucket_name)
    except ClientError as e:
        code = e.response['Error']['Code']
        if code in ['BucketAlreadyOwnedByYou', 'BucketAlreadyExists']:
            print("Bucket already exists. Continuing...")
        else:
            print(f"Bucket creation info: {e}")

    # Remove Public Access Block
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
        print(f"Public access block settings warning: {e}")

    # Apply Public Read Bucket Policy
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
        s3_client.put_bucket_policy(
            Bucket=bucket_name,
            Policy=json.dumps(bucket_policy)
        )
    except Exception as e:
        print(f"Bucket policy application info: {e}")

    # Enable Website Hosting
    s3_client.put_bucket_website(
        Bucket=bucket_name,
        WebsiteConfiguration={
            'IndexDocument': {'Suffix': 'index.html'},
            'ErrorDocument': {'Key': 'index.html'}
        }
    )

    # Upload dist directory
    dist_dir = os.path.join(os.path.dirname(__file__), 'dist')
    if not os.path.exists(dist_dir):
        print("dist directory not found! Run npm run build first.")
        sys.exit(1)

    print(f"Uploading production bundle files from {dist_dir} to s3://{bucket_name}...")
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

            print(f"  -> {relative_path} ({content_type})")
            with open(full_path, 'rb') as f:
                s3_client.put_object(
                    Bucket=bucket_name,
                    Key=relative_path,
                    Body=f,
                    ContentType=content_type
                )

    website_url = f"http://{bucket_name}.s3-website-us-east-1.amazonaws.com"
    print("\n" + "="*70)
    print("SUCCESS: AWS DEPLOYMENT COMPLETE!")
    print(f"AWS Service Used: AWS S3 Static Website Hosting")
    print(f"Final AWS Public URL: {website_url}")
    print("="*70 + "\n")

    # Save to file for documentation
    with open('aws_url.txt', 'w') as f:
        f.write(website_url)

if __name__ == '__main__':
    main()
