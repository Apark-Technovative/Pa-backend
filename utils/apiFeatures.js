class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  search(fields = []) {
    console.log("fields", fields);
    const keyword = this.queryStr.keyword?.trim();
    if (keyword && fields.length) {
      const regex = {
        $regex: keyword,
        $options: "i",
      };
      this.query = this.query.find({
        $or: fields.map((field) => ({ [field]: regex })),
      });
      return this;
    }
  }
  filter() {
    const queryObj = { ...this.queryStr };
    const excludedFields = ["page", "sort", "limit", "keyword", "order"];
    excludedFields.forEach((el) => delete queryObj[el]);
    console.log("excluded", excludedFields);
    console.log("query", queryObj);

    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }
  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(" ");
      console.log(sortBy);

      this.query = this.query.sort(sortBy);
    } else {
        this.query = this.query.sort("-createdAt");
    }
    return this;
  }
  pagination(){
    const page = Number(this.queryStr.page) || 1;
    const limit = Number(this.queryStr.limit) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = ApiFeatures;
