class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    filter() {
        let queryString = JSON.stringify(this.queryStr);
        console.log("Original Query String:", queryString);
    
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        const queryObj = JSON.parse(queryString);
    
        console.log("Parsed Filter Query:", queryObj); // Debugging
        this.query = this.query.find(queryObj);
        return this;
    }
    

    sort() {
        if (this.queryStr.sort) {
            const sortBy = this.queryStr.sort.split(",").join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    limitFields() {
        if (this.queryStr.fields) {
            const fields = this.queryStr.fields.split(",").map(field => field.trim());
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this; // Ensure chaining works
    }

    //BEFORE CORRECTION: THIS WAS WRONG
    // paginate() {
        //     const page = parseInt(this.queryStr.page) || 1;
        //     const limit = parseInt(this.queryStr.limit) || 10;
        //     this.query = this.query.skip((page - 1) * limit).limit(limit);
        //     return this;
    // }

        //AFTER CORRECTION: THIS IS THE CORRECT
        paginate() {
        const page = this.queryString.page ? this.queryString.page * 1 : null;
        const limit = this.queryString.limit ? this.queryString.limit * 1 : null;
    
        if (page && limit) {
            const skip = (page - 1) * limit;
            this.query = this.query.skip(skip).limit(limit);
        }
        return this;
    }
    
}

module.exports = ApiFeatures;
