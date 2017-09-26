const exec = require("child_process").exec;
const spawn = require("child_process").spawn;
const _ = require("lodash");
const argv = require("minimist")(process.argv.slice(2));
const request = require("request-promise");
let stage = argv.stage || "dev";
let serviceName = "clip-service";
let region = argv.region || "us-east-1";

let getAllApiEndpoints = () => {
  return new Promise((resolve, reject) => {
    const child = exec(
      `aws apigateway  get-rest-apis --region="${region}"`,
      (error, stdout, stderr) => {
        let apiEndpoints = JSON.parse(stdout);
        if (error !== null) {
          console.log(`exec error: ${error}`);
          process.exit(1);
        }
        return resolve(apiEndpoints.items);
      }
    );
  });
};

let findService = (apiEndpoints, serviceName) => {
  let discoveryId = "";
  _.each(apiEndpoints, api => {
    if (api.name === serviceName) {
      discoveryId = api.id;
    }
  });

  if (discoveryId === "") {
    console.log(`service ${serviceName} not found`);
    process.exit(1);
  }

  let serviceDiscovery = `https://${discoveryId}.execute-api.${region}.amazonaws.com/${stage}`;
  return serviceDiscovery;
};

let deployServerless = serviceDiscovery => {
  let err = false;
  return new Promise((resolve, reject) => {
    let cliArgs = [`-stage=${stage}`, "deploy"];
    serverlessDeploy = spawn("serverless", cliArgs);

    serverlessDeploy.stdout.on("data", function(data) {
      console.log(data.toString());
    });

    serverlessDeploy.stderr.on("data", function(data) {
      console.log("stderr: " + data.toString());
      err = true;
    });

    serverlessDeploy.on("exit", function(code) {
      if (code !== 0) {
        return reject(`serverless deploy exited with code ${code.toString()}`);
      }
      return resolve();
    });
  });
};

let registerService = (serviceInfo, serviceDiscovery) => {
  let options = {
    method: "POST",
    uri: `${serviceDiscovery}/services`,
    headers: { "Content-Type": "application/json" },
    json: serviceInfo
  };
  return request(options);
};

let deploy = () => {
  let serviceDiscovery = "";
  console.log("looking up service discovery");
  getAllApiEndpoints()
    .then(apiEndpoints => {
      serviceDiscovery = findService(
        apiEndpoints,
        `${stage}-discovery-service`
      );
      console.log("service discovery found");
      console.log("deploying with serverless");
      return deployServerless(serviceDiscovery);
    })
    .then(() => {
      console.log("serverless deployed");
      return getAllApiEndpoints();
    })
    .then(apiEndpoints => {
      console.log("finding current service endpoint");
      let currentServiceLocation = findService(
        apiEndpoints,
        `${stage}-${serviceName}`
      );
      console.log("currentServiceLocation", currentServiceLocation);
      let serviceInfo = {
        serviceName: serviceName,
        url: currentServiceLocation
      };
      return registerService(serviceInfo, serviceDiscovery);
    })
    .then(apiEndpoints => {
      console.log("service registered and deployed");
      process.exit();
    })
    .catch(err => {
      console.log("An error occured" + err);
      process.exit(1);
    });
};

deploy();
