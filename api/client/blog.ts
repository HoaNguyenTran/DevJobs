import requestApi from "api/config/requestApi"
import { validateResponse } from "api/config/validateApi"
import { AxiosResponse } from "axios"
import { FnewsCategorySchema, FnewsDetailSchema, FnewsSchema } from "src/entities/Fnews"

export const getBlogApi = async (params) => {
  // let url = `/fnews?page=${page}&limit=${limit}`;
  // { page = 1, limit = 10, type = 3, fjobNewCategoryId = 0 }
  // if (fjobNewCategoryId) {
  //   url += `&fjobNewCategoryId=${fjobNewCategoryId}`
  // } else {
  //   url += `&type=${type}`
  // }
  const res = await requestApi().get("/fnews", {params: {
    page: 1,
    limit: 10,
    ...params
  }})
  validateResponse("getBlogApi", FnewsSchema, res.data)
  return res
}

export const getBlogBySlugApi = async (slug: string): Promise<AxiosResponse<BlogGlobal.Blog>> => {
  const res = await requestApi().get(`/fnews/slug/${slug}`)
  validateResponse("getBlogBySlugApi", FnewsDetailSchema, res.data)
  return res
}

export const getListCategory = async (type: number): Promise<AxiosResponse<BlogGlobal.CategoryBlog[]>> => {
  const res = await requestApi().get(`/fjob-new-category/${type}`)
  validateResponse("getBlogBySlugApi", FnewsCategorySchema, res.data)
  return res
}

