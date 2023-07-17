const { fromIni } = require("@aws-sdk/credential-provider-ini");
const { IoTClient, CreateThingCommand } = require("@aws-sdk/client-iot");
const {
  GetThingShadowCommand,
  UpdateThingShadowCommand,
} = require("@aws-sdk/client-iot-data-plane");
const AWSIoT = require("aws-iot-device-sdk");
const { modbusCodes } = require("./modbusMapping.js");

require("dotenv").config();

const iotClient = new IoTClient({
  credentials: fromIni({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }),
  region: process.env.AWS_REGION,
});

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

const deviceNumber = devices.length;
const generateSerialNumber = (index) =>
  `AIR${index.toString().padStart(3, "0")}`;

for (let index = 0; index < deviceNumber; index++) {
  devices[index].serialNumber = generateSerialNumber(index);
  console.log(devices[index].serialNumber);
}

const createThings = async (deviceName, serialNumber) => {
  try {
    const command = new CreateThingCommand({ thingName: deviceName });
    const result = await iotClient.send(command);
    console.log(
      `Created device: ${result.thingName} - Serial no. ${serialNumber} - (${result.thingArn})`
    );

    const shadowCommand = new UpdateThingShadowCommand({
      thingName: deviceName,
      payload: JSON.stringify({ state: { desired: {} } }),
    });
    await iotClient.send(shadowCommand);
    console.log(`Created Thing Shadow for ${deviceName}`);
  } catch (error) {
    console.error("Error creating device:", error);
  }
};

// IMPORTANT: UNCOMMENT IF YOU NEED TO CREATE DEVICES
// devices.forEach((device) => {
//   createThings(device.name, device.serialNumber);
// });

const updatedShadowData = {
  state: {
    desired: {},
  },
};

devices.forEach(async (device) => {
  console.log(device.name);
  try {
    const airDev = AWSIoT.device({
      keyPath:
        "./certs/f0375098846b86f3104110b6e4c8efed24c9beb0c5fc930a094722315eebe1c3-private.pem.key",
      certPath:
        "./certs/f0375098846b86f3104110b6e4c8efed24c9beb0c5fc930a094722315eebe1c3-certificate.pem.crt",
      caPath: "./certs/AmazonRootCA1.pem",
      clientId: device.name,
      host: "a3e72y7msuwdkq-ats.iot.us-east-1.amazonaws.com",
    });

    airDev.on("connect", () => {
      console.log(`Connected to device: ${device.name}`);
      // Perform actions to control or monitor the device using airDev
      // For example, you can publish messages to control the device or subscribe to topics to receive data from the device.
      // Refer to the AWS IoT Device SDK documentation for more information on publishing and subscribing.

      // Get the current Thing Shadow state
      const shadowName = `device_${device.name}`;
      const getShadowCommand = new GetThingShadowCommand({
        thingName: shadowName,
      });
      iotClient
        .send(getShadowCommand)
        .then((response) => {
          const shadowData = JSON.parse(response.payload.toString());
          console.log(`Shadow data for ${shadowName}:`, shadowData.state);
        })
        .catch((error) => {
          console.error(
            `Error retrieving Thing Shadow for ${shadowName}:`,
            error
          );
        });

      // // Example: Update the Thing Shadow state
      // const updatedShadowData = {
      //   state: {
      //     desired: {
      //       power: true,
      //     },
      //   },
      // };

      // Initialize desired state for each MODBUS code
      modbusCodes.forEach((modbus) => {
        switch (modbus.type) {
          case "boolean":
            updatedShadowData.state.desired[modbus.code] = false;
            break;
          case "float":
            updatedShadowData.state.desired[modbus.code] = 0.0;
            break;
          case "string":
            updatedShadowData.state.desired[modbus.code] = "";
            break;
          default:
            // Type undefined or not supported
            break;
        }
      });

      const updateShadowCommand = new UpdateThingShadowCommand({
        thingName: shadowName,
        payload: JSON.stringify(updatedShadowData),
      });
      iotClient
        .send(updateShadowCommand)
        .then((response) => {
          console.log("RES:", response);
          updatedShadowData.state.desired[modbus.code] = false;
          console.log(`Updated Thing Shadow for ${shadowName}`);
        })
        .catch((error) => {
          console.error(
            `Error updating Thing Shadow for ${shadowName}:`,
            error
          );
        });
    });

    airDev.on("error", (error) => {
      console.error(`Error connecting to ${device.name}:`, error);
    });
    // await iotClient.send(updateShadowCommand);
    console.log(`Updated Thing Shadow for ${device.name}`);
  } catch (error) {
    console.error(`Error connecting to ${device.name}:`, error);
  }
});
