import { API_RESPONSES } from "@/constants/responses";
import { HTTP_STATUS_CODES } from "@/constants/statusCodes";
import { createPost, getPostById } from "@/services/post.service";
import { sendResponse } from "@/services/response.service";

export const addNewPost = async (req: any, res: any) => {
  try {
    const post = await createPost(req.body);
    if (!post) {
      return sendResponse({
        res,
        status: HTTP_STATUS_CODES.BAD_REQUEST,
        message: API_RESPONSES.RESOURCE_CREATION_FAILED,
      });
    }
    post.userId = req.user._id;
    await post.save({ validateBeforeSave: false });
    return sendResponse({
      res,
      status: HTTP_STATUS_CODES.CREATED,
      message: API_RESPONSES.RESOURCE_CREATED,
    });
  } catch (error) {
    if (error) {
      return sendResponse({
        res,
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        error: error,
        message: API_RESPONSES.INTERNAL_SERVER_ERROR,
      });
    }
  }
};

export const getSinglePost = async (req: any, res: any) => {
  try {
    const post = await getPostById(req.params.id).select("-__v");
    if (!post) {
      return sendResponse({
        res,
        status: HTTP_STATUS_CODES.NOT_FOUND,
        message: API_RESPONSES.RESOURCE_NOT_FOUND,
      });
    }
    return sendResponse({
      res,
      status: HTTP_STATUS_CODES.OK,
      message: API_RESPONSES.RESOURCE_FETCHED,
      data: post,
    });
  } catch (error: any) {
    return sendResponse({
      res,
      status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: error.message || error,
      message: API_RESPONSES.INTERNAL_SERVER_ERROR,
    });
  }
};
