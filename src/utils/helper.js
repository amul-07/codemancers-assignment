export const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((element) => {
        if (allowedFields.includes(element)) newObj[element] = obj[element];
    });
    return newObj;
};
