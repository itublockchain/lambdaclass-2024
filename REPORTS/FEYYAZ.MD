# Tantalus

###### Feyyaz Numan Cavlak - 25.07.2024 - arm64 - node@20.15.0 - npm@10.7.0

Hackathon esnasında AWS EC2 instance'ını nasıl otomatik olarak oluşturabileceğimizi çok anlamlandıramamıştık. Bu nedenle projede sidechain oluşumunu manuel olarak göstermek zorunda kaldık.

# AWS CLI ile EC2 Instace Launch Etmek

### Kurulum

Python ve pip'in kurulu geldiğini varsayarak:
```bash=
    pip3 install awscli --upgrade --user
```
Bu noktada `aws --version` yaptığında tanımayacak. Ardından bunu çalıştırıyorum:
```bash=
    sudo pip3 install awscli --force-reinstall --upgrade
```
Ardından kontrol ediyorum:
```bash=
    aws --version
    // aws-cli/1.33.31 Python/3.12.2 Darwin/23.5.0 botocore/1.34.149
```
---

### Authenticate with IAM User Credentials

[Bu siteden](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html#id_users_create_console) dökümanı takip ederek IAM user oluşturuyorum. Dökümanda takip etmem gereken section: **Creating IAM users (console)**.

![Ekran Resmi 2024-07-27 00.25.53](https://hackmd.io/_uploads/HJw_NqbtC.png)

İşlem bitince böyle bir çıktıya sahip oluyor.

### Using `aws configure`
For general use, the aws configure command is the fastest way to set up your AWS CLI installation. This configure wizard prompts you for each piece of information you need to get started. Unless otherwise specified by using the --profile option, the AWS CLI stores this information in the default profile.

The following example configures a default profile using sample values. Replace them with your own values as described in the following sections.

```bash=
    $ aws configure
    AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
    AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
    Default region name [None]: us-west-2
    Default output format [None]: json
```

Daha sonra Console'da IAM Section'dan User'a tıklayıp Permissions kısmından Add Permissions menüsünü bulup oradan `Create inline policy` seçeneğini seçiyorsun. Ve şunu yapıştırıyorsun:

```bash=
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ec2:Describe*",
                "ec2:GetConsole*"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": "ec2:RunInstances",
            "Resource": [
                "arn:aws:ec2:*:*:subnet/subnet-subnet-id",
                "arn:aws:ec2:*:*:network-interface/*",
                "arn:aws:ec2:*:*:instance/*",
                "arn:aws:ec2:*:*:volume/*",
                "arn:aws:ec2:*::image/ami-*",
                "arn:aws:ec2:*:*:key-pair/*",
                "arn:aws:ec2:*:*:security-group/*"
            ]
        }
    ]
}
```

### CREATE INSTANCE (SONUNDA)

Artık instance oluşturmaya hazırsın:
```bash=
    aws ec2 run-instances --image-id ami-0e872aee57663ae2d --count 1 --instance-type t2.micro --key-name ssh
```

**NOT: Ubuntu default AMI: ami-0e872aee57663ae2d (başka sistemleri araştırıp bulabilirsin)** ve **---key-name komutu çalıştırdığın ortamdaki pem dosyasının ismi (ssh.pem için ssh)**

Bu işin sonunda örnek çıktı şu şekilde:
```jsonld=
{
    "Groups": [],
    "Instances": [
        {
            "AmiLaunchIndex": 0,
            "ImageId": "ami-0e872aee57663ae2d",
            "InstanceId": "i-08f65788866a1fbab",
            "InstanceType": "t2.micro",
            "KeyName": "ssh",
            "LaunchTime": "2024-07-26T21:43:01.000Z",
            "Monitoring": {
                "State": "disabled"
            },
            "Placement": {
                "AvailabilityZone": "eu-central-1b",
                "GroupName": "",
                "Tenancy": "default"
            },
            "PrivateDnsName": "ip-172-31-35-197.eu-central-1.compute.internal",
            "PrivateIpAddress": "172.31.35.197",
            "ProductCodes": [],
            "PublicDnsName": "",
            "State": {
                "Code": 0,
                "Name": "pending"
            },
            "StateTransitionReason": "",
            "SubnetId": "subnet-023dea174bf5e3fb8",
            "VpcId": "vpc-078d36cba867fb7f4",
            "Architecture": "x86_64",
            "BlockDeviceMappings": [],
            "ClientToken": "42bfae35-dcf2-49f5-9453-292316e44bd9",
            "EbsOptimized": false,
            "EnaSupport": true,
            "Hypervisor": "xen",
            "NetworkInterfaces": [
                {
                    "Attachment": {
                        "AttachTime": "2024-07-26T21:43:01.000Z",
                        "AttachmentId": "eni-attach-09f375172d78d39ef",
                        "DeleteOnTermination": true,
                        "DeviceIndex": 0,
                        "Status": "attaching",
                        "NetworkCardIndex": 0
                    },
                    "Description": "",
                    "Groups": [
                        {
                            "GroupName": "default",
                            "GroupId": "sg-04b757535eb82380f"
                        }
                    ],
                    "Ipv6Addresses": [],
                    "MacAddress": "06:b9:b9:bc:41:c5",
                    "NetworkInterfaceId": "eni-02c1cd8c426d749da",
                    "OwnerId": "991385536400",
                    "PrivateDnsName": "ip-172-31-35-197.eu-central-1.compute.internal",
                    "PrivateIpAddress": "172.31.35.197",
                    "PrivateIpAddresses": [
                        {
                            "Primary": true,
                            "PrivateDnsName": "ip-172-31-35-197.eu-central-1.compute.internal",
                            "PrivateIpAddress": "172.31.35.197"
                        }
                    ],
                    "SourceDestCheck": true,
                    "Status": "in-use",
                    "SubnetId": "subnet-023dea174bf5e3fb8",
                    "VpcId": "vpc-078d36cba867fb7f4",
                    "InterfaceType": "interface"
                }
            ],
            "RootDeviceName": "/dev/sda1",
            "RootDeviceType": "ebs",
            "SecurityGroups": [
                {
                    "GroupName": "default",
                    "GroupId": "sg-04b757535eb82380f"
                }
            ],
            "SourceDestCheck": true,
            "StateReason": {
                "Code": "pending",
                "Message": "pending"
            },
            "VirtualizationType": "hvm",
            "CpuOptions": {
                "CoreCount": 1,
                "ThreadsPerCore": 1
            },
            "CapacityReservationSpecification": {
                "CapacityReservationPreference": "open"
            },
            "MetadataOptions": {
                "State": "pending",
                "HttpTokens": "required",
                "HttpPutResponseHopLimit": 2,
                "HttpEndpoint": "enabled",
                "HttpProtocolIpv6": "disabled",
                "InstanceMetadataTags": "disabled"
            },
            "EnclaveOptions": {
                "Enabled": false
            },
            "BootMode": "uefi-preferred",
            "PrivateDnsNameOptions": {
                "HostnameType": "ip-name",
                "EnableResourceNameDnsARecord": false,
                "EnableResourceNameDnsAAAARecord": false
            },
            "MaintenanceOptions": {
                "AutoRecovery": "default"
            },
            "CurrentInstanceBootMode": "legacy-bios"
        }
    ],
    "OwnerId": "991385536400",
    "ReservationId": "r-006a000949479e24e"
}
```

### PEKİ OLUŞAN İSİMSİZ INSTANCE'A NASIL İSİM VERİRİM:

Yukarıda belirtilen instanceId'yi alıp tag atıyorum.

```bash
    aws ec2 create-tags --resources i-08f65788866a1fbab --tags Key=Name,Value=MyInstance
```

Bu kadar. ARTIK INSTANCE OLUŞTURMAYI OTOMATİZE EDEBİLİRSİN.

---

##### Next Steps:
- Kendi imajlarını oluşturmak.

