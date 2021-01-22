module.exports = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    //replace(RegExp/g, something) - regExp позволяет заменить не только первое вхождение
    //в отличие от строки '{%PRODUCTNAME%}'
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%ID%}/g, product.id);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    if (!product.organic) {
        output.replace(/{%NOT_ORGANIC%}/g, 'not_organic');
    }

    return output
   
};