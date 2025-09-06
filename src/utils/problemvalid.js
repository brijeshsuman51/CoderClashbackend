const axios = require("axios")

const getLanguageById = (lang)=>{
    const language = {
        "c++":54,
        "java":62,
        "javascript":63
    }
    return language[lang.toLowerCase()]
}

const submitBatch = async (submissions) => {

const options = {
  method: 'POST',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    base64_encoded: 'false'
  },
  headers: {
    'x-rapidapi-key':process.env.JUDGE0_KEY,
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  data: {
    submissions
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data
	} catch (error) {
		console.error(error);
	}
}

return await fetchData();

}
const waiting = async(timer)=>{
    setTimeout(() => {
        return 1;
    }, timer);
}
const submitToken = async (resultToken) => {

const options = {
  method: 'GET',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    tokens: resultToken.join(','),
    base64_encoded: 'false',
    fields: '*'
  },
  headers: {
    'x-rapidapi-key': process.env.JUDGE0_KEY,
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data
	} catch (error) {
		console.error(error);
	}
}

while(true){
    const result = await fetchData();

    const ResultObtained = result.submissions.every((r)=>r.status_id>2)
    if(ResultObtained)
        return result.submissions;

    await waiting(1000)
}
}

const problemStatus = async (data) => {
    const {title,description,difficulty,tags,
      visibleTestCases,hiddenTestCases,startCode,
        referenceSolution, problemCreator} = data
    for(const {language,completeCode} of referenceSolution){
        const languageId = getLanguageById(language)
        
        const submissions = visibleTestCases.map((testcase)=>({
            source_code:completeCode,
            language_id:languageId,
            stdin:testcase.input,
            expected_output:testcase.output,
        }));
        
        const submitResult = await submitBatch(submissions)
        
        const resultToken = submitResult.map((value)=>value.token)
        
        const testResult = await submitToken(resultToken)
        // console.log(testResult)
        
        for(const test of testResult){
            if(test.status_id!=3){
                return "Error Occured43"
            }
        }
    }
}

module.exports = {getLanguageById,submitBatch,submitToken,problemStatus}