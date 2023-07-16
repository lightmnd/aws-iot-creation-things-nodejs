const pem = require("pem");
const { fromIni } = require("@aws-sdk/credential-provider-ini");
const { IotClient } = require("@aws-sdk/client-iot");
const AWS = require("aws-sdk");
const AWSIoT = require("aws-iot-device-sdk");
const { IoTClient, CreateThingCommand } = require("@aws-sdk/client-iot");
const { GetThingShadowCommand } = require("@aws-sdk/client-iot");
const { UpdateThingShadowCommand } = require("@aws-sdk/client-iot");
const { booleanModbusCodes } = require("./modbusMapping.js");

require("dotenv").config();
const iotClient = new IoTClient({
  credentials: fromIni({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }),
  region: process.env.AWS_REGION,
});
// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });

const devices = [
  {
    name: "device_01",
    serialNumber: "",
    // type: "air_dehumidifier",
  },
  {
    name: "device_02",
    serialNumber: "",
    // type: "air_dehumidifier",
  },
  {
    name: "device_03",
    serialNumber: "",
    // type: "air_dehumidifier",
  },
  {
    name: "device_04",
    serialNumber: "",
    // type: "air_dehumidifier",
  },
  {
    name: "device_05",
    serialNumber: "",
    // type: "air_dehumidifier",
  },
  {
    name: "device_06",
    serialNumber: "",
    // type: "air_dehumidifier",
  },
  {
    name: "device_07",
    serialNumber: "",
    // type: "air_dehumidifier",
  },
  {
    name: "device_08",
    serialNumber: "",
    // type: "air_dehumidifier",
  },
  {
    name: "device_09",
    serialNumber: "",
    // type: "air_dehumidifier",
  },
  {
    name: "device_10",
    serialNumber: "",
    // type: "air_dehumidifier",
  },
];

// const iotClient = new IoTClient({ region: process.env.AWS_REGION });
const deviceNumber = 10;
const generateSerialNumber = (index) =>
  `AIR${index.toString().padStart(3, "0")}`;

for (let index = 0; index < deviceNumber; index++) {
  devices[index].serialNumber = generateSerialNumber(index);
  console.log(devices[index].serialNumber);
}

// Eg: { ThingName: "device001", SerialNumber: "AIR001", CSR: "csr1" },
const createThings = async (deviceName, serialNumber) => {
  try {
    // Generate CSR
    const csrOptions = {
      commonName: deviceName,
      keyBitsize: 2048,
    };
    const { csr } = await new Promise((resolve, reject) => {
      pem.createCSR(csrOptions, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    // Create AWS IoT Thing
    // const params = {
    //   thingName: deviceName,
    //   attributePayload: {
    //     attributes: {
    //       SerialNumber: serialNumber,
    //       csr,
    //     },
    //     merge: true,
    //   },
    // };
    // const result = await iot.createThing(params).promise();
    const command = new CreateThingCommand({ thingName: deviceName });
    const result = await iotClient.send(command);
    console.log(
      `Created device: ${result.thingName} - Serial no. ${serialNumber} - (${result.thingArn})`
    );
  } catch (error) {
    console.error("Error creating device:", error);
  }
};

devices.forEach((device) => {
  createThings(device.name, device.serialNumber /*, device.type*/);
});

// Connect to all the devices
// const iotClient = new IoTClient({ region: process.env.AWS_REGION });
devices.forEach(async (device) => {
  try {
    const airDev = AWSIoT.device({
      keyPath: "./certs/private-key.pem",
      certPath: "./certs/certificate.pem",
      caPath: "./certs/root-ca.crt",
      clientId: device.name,
      host: "a3e72y7msuwdkq-ats.iot.us-east-1.amazonaws.com",
    });

    booleanModbusCodes.forEach((code) => {
      console.log(code.type);
      // Object.entries(booleanModbusCodes).forEach(([code, value]) => {
      // console.log(`${code}: ${value}`);
    });
  } catch (error) {
    console.error(`Error connecting to ${device.name}:`, error);
  }
});

/* Nice to have 
  create Rest APIs to use data in a dedicated web or mobile application
*/

// Example:
// app.get("/devices", () => {
//   console.log("all devices data");
// });

// app.get("/devices:name", () => {
//   console.log("get data by device name");
// });

// update device status (remote controls, eg: ON/OFF)
// app.put("/devices:name", (req, res) => {
//   req.body.powerOn = !req.body.powerOn;
// });

// ("localhost:4000/device/device_01 ---> device data");
