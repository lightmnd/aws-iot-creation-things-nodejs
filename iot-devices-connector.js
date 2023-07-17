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

console.log("====>=", process.env.AWS_REGION);

const deviceNumber = devices.length;
const generateSerialNumber = (index) =>
  `AIR${index.toString().padStart(3, "0")}`;

for (let index = 0; index < deviceNumber; index++) {
  devices[index].serialNumber = generateSerialNumber(index);
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
    // console.log(`Created Thing Shadow for ${deviceName}`);
  } catch (error) {
    // console.error("Error creating device:", error);
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

devices.forEach(async (device, i = 1) => {
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
      console.log(`Connected to AWS`);
      // console.log(`Connected to device: ${device.name}`);
      // Perform actions to control or monitor the device using airDev
      // For example, you can publish messages to control the device or subscribe to topics to receive data from the device.
      // Refer to the AWS IoT Device SDK documentation for more information on publishing and subscribing.

      // Get the current Thing Shadow state
      const shadowName = `${device.name}`;
      const getShadowCommand = new GetThingShadowCommand({
        thingName: shadowName,
      });
      console.log(getShadowCommand);
      iotClient
        .send(getShadowCommand)
        .then((response) => {
          const payloadString = response.payload.toString();
          // console.log(`Raw Shadow data for ${shadowName}:`, payloadString);
          try {
            const shadowData = JSON.parse(payloadString);
            // console.log(`Shadow data for ${shadowName}:`, shadowData.state);
          } catch (error) {
            // console.error(`Error parsing JSON for ${shadowName}:`, error);
          }
        })
        .catch((error) => {
          // console.error(
          //   `Error retrieving Thing Shadow for ${shadowName}:`,
          //   error
          // );
        });

      // Initialize desired state for each MODBUS code
      modbusCodes.forEach((modbus) => {
        switch (modbus.type) {
          case "boolean":
            updatedShadowData.state.desired[modbus.code] = true;
            break;
          case "float":
            updatedShadowData.state.desired[modbus.code] = 20.0;
            break;
          case "string":
            updatedShadowData.state.desired[modbus.code] = "lorem ipsum";
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
          const parsedResponse = JSON.parse(response?.payload.toString());
          if (parsedResponse.state && parsedResponse.state.reported) {
            // Retrieve the updated state from the response
            const updatedState = parsedResponse.state.reported;

            // Perform any necessary actions with the updated state
            // console.log(`Updated state for ${shadowName}:`, updatedState);
          } else {
            // console.log(`Successfully updated Thing Shadow for ${shadowName}`);
          }
        })
        .catch((error) => {
          // console.error(
          //   `Error updating Thing Shadow for ${shadowName}:`,
          //   error
          // );
          // console.log(`Raw response for ${shadowName}:`, error.$response);
        });
    });

    airDev.on("error", (error) => {
      console.error(`Error connecting to ${device.name}:`, error);
    });
  } catch (error) {
    console.error(`Error connecting to ${device.name}:`, error);
  }
});
