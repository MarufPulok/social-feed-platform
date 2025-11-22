export interface CreateCommentReqDto {
  postId: string;
  content: string;
  parentCommentId?: string;
}
export interface GetCommentsReqDto {
  postId: string;
}
export interface LikeCommentReqDto {
  commentId: string;
}
