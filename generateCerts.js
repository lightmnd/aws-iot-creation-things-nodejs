const pem = require("pem");
const fs = require("fs");

const generateCertificates = () => {
  return new Promise((resolve, reject) => {
    pem.createCertificate({ days: 1, selfSigned: true }, (err, keys) => {
      if (err) {
        reject(err);
      } else {
        resolve(keys);
      }
    });
  });
};

const generatePaths = async () => {
  try {
    const { serviceKey, certificate, ca } = await generateCertificates();
    const keyPath =
      "./certs/f0375098846b86f3104110b6e4c8efed24c9beb0c5fc930a094722315eebe1c3-private.pem.key";
    const certPath =
      "./certs/f0375098846b86f3104110b6e4c8efed24c9beb0c5fc930a094722315eebe1c3-certificate.pem.crt";
    const caPath = "./certs/AmazonRootCA1.pem";

    // Save the private key, certificate, and CA to files
    fs.writeFileSync(keyPath, serviceKey);
    fs.writeFileSync(certPath, certificate);
    fs.writeFileSync(caPath, ca);

    console.log("Certificates generated successfully");
  } catch (error) {
    console.error("Error generating certificates:", error);
  }
};

generatePaths();
