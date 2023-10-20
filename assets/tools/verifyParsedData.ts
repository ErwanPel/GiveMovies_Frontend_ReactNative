// const verifyParsedData<T> = (data: T, ZodSchema: T) => {
//   const dataToVerify:  = data;

//   const parsedData = ZodSchema.parse(dataToVerify);
// };

export function verifyParsedData<T>(data: T, ZodSchema: any) {
  try {
    return ZodSchema.parse(data);
  } catch (error: any) {
    console.log(error);
  }
}
