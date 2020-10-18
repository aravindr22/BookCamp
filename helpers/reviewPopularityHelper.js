exports.reviewPopularityCalculator = (rating) =>{
    switch(rating){
        case 1: return -1; break;
        case 2: return -0.5; break;
        case 3: return 0.1; break;
        case 4: return 0.6; break;
        case 5: return 1.2; break;
    }
}