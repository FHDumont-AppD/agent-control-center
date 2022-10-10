import { Response } from "express";
const ErrorHandler = require("../helper/ErrorHandler");

const createResponse = async (res: Response, statusCode: number, data: any) => {
  let result: any = {
    status: statusCode || 500,
    isError: statusCode != 200,
  };

  if (statusCode == 200) {
    result = {
      ...result,
      payload: data,
    };
  } else {
    result = {
      ...result,
      isOperational: data.isOperational || false,
      detail: data.message || data,
    };
  }

  return res.status(statusCode).json(result);
};

export default {
  createResponse,
};
