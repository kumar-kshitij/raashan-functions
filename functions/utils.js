exports.getParamsFromRequest = req => {
    let params
    if (typeof req.body === 'string' || req.body instanceof String) {
        params = JSON.parse(req.body)
    } else {
        params = JSON.parse(JSON.stringify(req.body))
    }
    return params;
}
  