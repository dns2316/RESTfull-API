function checkEmpyInArray(array){
  console.log(typeof(array))
  return outArray = array.filter(item => { return !!item });
}
module.exports = checkEmpyInArray;
