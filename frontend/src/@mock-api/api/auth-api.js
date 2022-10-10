import FuseUtils from "src/@internal/utils";
import _ from "@lodash";
import Base64 from "crypto-js/enc-base64";
import HmacSHA256 from "crypto-js/hmac-sha256";
import Utf8 from "crypto-js/enc-utf8";
import jwtDecode from "jwt-decode";
import mock from "../mock";
import mockApi from "../mock-api.json";
import axios from "axios";

let usersApi = mockApi.components.examples.auth_users.value;

/* eslint-disable camelcase */

mock.onGet("/api/auth/sign-in").reply(async (config) => {
  const data = JSON.parse(config.data);
  const user = _.cloneDeep(
    usersApi.find((_user) => _user.data.email === "acc@appdynamics.com")
  );

  const error = [];

  const responseLogin = await axios.post(`/v1/appd/login`, data);
  const dataLogin = await responseLogin.data.payload;

  if (responseLogin.status != 200) {
    error.push({ type: "access", messgage: "Login invalid" });
  }

  if (error.length === 0) {
    delete user.password;

    const access_token = generateJWTToken({ id: data.clientName });

    localStorage.setItem("access_token", dataLogin);
    localStorage.setItem("clientName", data.clientName);

    const response = {
      user: {
        ...user,
        data: {
          ...user.data,
          displayName: data.clientName,
          controller: data.controller,
        },
      },
      access_token,
    };

    return [200, response];
  }

  return [200, { error }];
});

mock.onGet("/api/auth/access-token").reply((config) => {
  let clientName = localStorage.getItem("clientName");

  const user = usersApi.find(
    (_user) => _user.data.email === "acc@appdynamics.com"
  );

  delete user.password;

  const updatedAccessToken = generateJWTToken({ id: clientName });

  const response = {
    user: {
      ...user,
      data: { ...user.data, displayName: clientName },
    },
    access_token: updatedAccessToken,
  };

  return [200, response];
});

mock.onPost("/api/auth/sign-up").reply((request) => {
  const data = JSON.parse(request.data);
  const { displayName, password, email } = data;
  const isEmailExists = usersApi.find((_user) => _user.data.email === email);
  const error = [];

  if (isEmailExists) {
    error.push({
      type: "email",
      message: "The email address is already in use",
    });
  }

  if (error.length === 0) {
    const newUser = {
      uuid: FuseUtils.generateGUID(),
      from: "custom-db",
      password,
      role: "admin",
      data: {
        displayName,
        photoURL: "assets/images/avatars/Abbott.jpg",
        email,
        settings: {},
        shortcuts: [],
      },
    };

    usersApi = [...usersApi, newUser];

    const user = _.cloneDeep(newUser);

    delete user.password;

    const access_token = generateJWTToken({ id: user.uuid });

    const response = {
      user,
      access_token,
    };

    return [200, response];
  }
  return [200, { error }];
});

mock.onPost("/api/auth/user/update").reply((config) => {
  const data = JSON.parse(config.data);
  const { user } = data;

  usersApi = usersApi.map((_user) => {
    if (user.uuid === user.id) {
      return _.merge(_user, user);
    }
    return _user;
  });

  return [200, user];
});

/**
 * JWT Token Generator/Verifier Helpers
 * !! Created for Demonstration Purposes, cannot be used for PRODUCTION
 */

const jwtSecret = "some-secret-code-goes-here";

function base64url(source) {
  // Encode in classical base64
  let encodedSource = Base64.stringify(source);

  // Remove padding equal characters
  encodedSource = encodedSource.replace(/=+$/, "");

  // Replace characters according to base64url specifications
  encodedSource = encodedSource.replace(/\+/g, "-");
  encodedSource = encodedSource.replace(/\//g, "_");

  // Return the base64 encoded string
  return encodedSource;
}

function generateJWTToken(tokenPayload) {
  // Define token header
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  // Calculate the issued at and expiration dates
  const date = new Date();
  const iat = Math.floor(date.getTime() / 1000);
  const exp = Math.floor(date.setDate(date.getDate() + 7) / 1000);

  // Define token payload
  const payload = {
    iat,
    iss: "Fuse",
    exp,
    ...tokenPayload,
  };

  // Stringify and encode the header
  const stringifiedHeader = Utf8.parse(JSON.stringify(header));
  const encodedHeader = base64url(stringifiedHeader);

  // Stringify and encode the payload
  const stringifiedPayload = Utf8.parse(JSON.stringify(payload));
  const encodedPayload = base64url(stringifiedPayload);

  // Sign the encoded header and mock-api
  let signature = `${encodedHeader}.${encodedPayload}`;
  signature = HmacSHA256(signature, jwtSecret);
  signature = base64url(signature);

  // Build and return the token
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function verifyJWTToken(token) {
  // Split the token into parts
  const parts = token.split(".");
  const header = parts[0];
  const payload = parts[1];
  const signature = parts[2];

  // Re-sign and encode the header and payload using the secret
  const signatureCheck = base64url(
    HmacSHA256(`${header}.${payload}`, jwtSecret)
  );

  // Verify that the resulting signature is valid
  return signature === signatureCheck;
}
