class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          $or: [
            { name: { $regex: this.queryStr.keyword, $options: "i" } },
            { email: { $regex: this.queryStr.keyword, $options: "i" } },
            { mobile: { $regex: this.queryStr.keyword, $options: "i" } },
            { city: { $regex: this.queryStr.keyword, $options: "i" } },
          ],
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };

    const removeFields = ["keyword", "page", "limit", "sort", "fields"];
    removeFields.forEach((key) => delete queryCopy[key]);

    this.query = this.query.find(queryCopy);
    return this;
  }

  sort() {
    const sortBy = this.queryStr.sort
      ? this.queryStr.sort.split(",").join(" ")
      : "-createdAt";
    this.query = this.query.sort(sortBy);
    return this;
  }

  paginate() {
    const currentPage = Number(this.queryStr.page) || 1;
    const resultPerPage = Number(this.queryStr.limit) || 10;
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

export default ApiFeatures;
