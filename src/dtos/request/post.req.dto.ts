export interface CreatePostReqDto {
  content: string;
  imageUrl?: string;
  isPrivate: boolean;
}
export interface UpdatePostReqDto {
  content?: string;
  imageUrl?: string;
  isPrivate?: boolean;
}
export interface GetPostsReqDto {
  cursor?: string;
  limit?: number;
}
export interface LikePostReqDto {
  postId: string;
}
