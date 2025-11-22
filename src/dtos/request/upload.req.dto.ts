export interface UploadImageReqDto {
  file: File;
  type: "post" | "profile" | "comment";
}
