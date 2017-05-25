export class QuestionDto {
    questionId: string;
    question: string;
    category: string;
    correctAns: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    multiFlag: boolean;
    total_No_of_Qsns_Per_QsnPaperId:number;
    endingTime:string;
}
