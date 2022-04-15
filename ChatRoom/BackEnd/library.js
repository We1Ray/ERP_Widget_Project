class library {
  queryConvert(parameterizedSql, params) {
    const [text, values] = Object.entries(params).reduce(
      ([sql, array, index], [key, value]) => [
        sql.replace(`:${key}`, `$${index}`),
        [...array, value],
        index + 1,
      ],
      [parameterizedSql, [], 1]
    );
    return { text, values };
  }
}

const lib = new library();
module.exports = lib;
