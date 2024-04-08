import { allowedDirection, allowedSortBy } from "../db/models/post";

export function validateSortByParams(sortBy: string): allowedSortBy {
  return sortBy && allowedSortBy[sortBy as keyof typeof allowedSortBy]
    ? (sortBy as allowedSortBy)
    : allowedSortBy.id;
}

export function validateDirectionParams(direction: string): allowedDirection {
  return direction &&
    allowedDirection[direction as keyof typeof allowedDirection]
    ? (direction as allowedDirection)
    : allowedDirection.asc;
}
