/* eslint-disable node/no-unsupported-features/es-syntax */
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };

    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    //1) filtering //url?active=0&lat=20
    excludedFields.forEach((el) => delete queryObj[el]);
    //2) advanced filtering //url?lat[gte]=20
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    //3)sorting //url?sort=lat for ascending and -lat for descending
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' '); //url?sort=lat,lng
      this.query = this.query.sort(sortBy); //chaining the sort this.queryString with the filter this.queryString
    } else {
      this.query = this.query.sort('-dateOfEntry');
    }

    return this;
  }

  limiting() {
    //3) field limiting //url?fields=name,remedy,category
    if (this.queryString.fields) {
      const limit = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(limit);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  pagination() {
    //4) pagination //url?page=2&limit=10
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    let skip;
    if (page - 1 === 0) {
      skip = 0;
    } else {
      skip = (page - 1) * limit;
    }

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
