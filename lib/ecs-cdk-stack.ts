import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';

export class EcsCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'MyVpc', {
      maxAzs: 3, // Default is all AZs in region
    });

    const cluster = new ecs.Cluster(this, 'WorkshopCluster', {
      vpc: vpc,
    });



    const autoScalingGroup = new autoscaling.AutoScalingGroup(this, 'MyFleet', {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: ecs.EcsOptimizedImage.amazonLinux2023(),
      minCapacity: 0,
			desiredCapacity:0,
      maxCapacity: 2,
    });

    const capacityProvider = new ecs.AsgCapacityProvider(this, 'WorkshopCapacityProvider', { autoScalingGroup });

    cluster.addAsgCapacityProvider(capacityProvider);
  }
}
