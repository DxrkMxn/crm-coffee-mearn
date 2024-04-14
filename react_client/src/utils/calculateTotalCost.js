const calculateTotalCost = (historyItem) => {
    return historyItem.list.reduce((acc, el) => {
        return (acc += el.quantity ? el.cost * el.quantity : el.cost);
    }, 0);
};

export default calculateTotalCost