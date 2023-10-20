export const setPictureToUpload = (picture: string | null) => {
  const tab = picture?.split(".");
  const pictureUri = picture;
  const namePicture = `profil.${tab && tab.at(-1)}`;
  const mimetype = `image/${tab && tab.at(-1)}`;
  const pictureData: any = {
    uri: pictureUri,
    name: namePicture,
    type: mimetype,
  };
  return pictureData;
};
