/**
 * Created by KurtGranborg on 11/6/2017.
 */
import React, {Component} from 'react';
//import  {Footer} from 'react-footer';
import axios from 'axios'
import {Table} from 'react-bootstrap'

import '../css/header.css'

// a file with static home page content


//Loads data from server and presents it in a table
class Home extends Component{
    constructor(props){
        super(props);
        this.state = {data: []}
    }


    //Loads the data before the component mounts
    componentWillMount(){
       
    };

    tempReplacecode(){


    }


    render(){
        //Get variables from state
        const {data, error} = this.state;
        //If data is [], returns loading
        if(!data)
            return <h1>Loading</h1>;
        //If there's an error give a message.
        if(error)
            return <h1>An error occured</h1>
        return (
            <div className="bodyClass">
              <center><h1>Everything You Need to Know About STARS </h1></center>
              <br/>
              <h3>What is the STARS Report?</h3>
              <p>
                STARS stands for Sustainability Tracking, Assessment, and Rating System. It is a transparent tool/self-reporting framework created by the Association for the Advancement of Sustainability in Higher Education (AASHE) to assist colleges and universities in measuring their sustainability performance. The STARS report consists of 75 “credits”, which are divided between the four areas/categories of Academics, Engagement, Operations, and Planning & Administration. The credits are referred to by an abbreviation of the category it is within followed by a number (e.g. AC-1, OP-13, PA-4). Each credit is unique and requires either quantitative data sets, or qualitative data and narratives. The report allows universities to see which areas of their campus are making strides in sustainability, as well as which areas could be improved.
              </p>

            <h2>How do you collect data?</h2>
            <p>
                The data needed for each credit is collected by contacting the appropriate/responsible parties on campus. For example, for the area of Engagement, the Center for Community Engagement is a good place to start. For the area of Operations, Facilities Management will be a main contact. Refer to the Contacts excel sheet that can be found in every area’s folder in the Google Drive. 
                It is recommended that you start by sending an email that explains the purpose of the STARS report, what area/credits of the report you are working on, and what specific questions you need them to answer. If the first email you send receives no response, send a follow-up email with the previous email forwarded/attached. Refer to the two documents Email Template for Contacts, and Assertive/Follow-up Email Template in the Google Drive. If your emails are unsuccessful, try contacting the appropriate party via phone or perhaps an in-person visit to their office. 
            </p>
            <h2> How do you receive points? </h2>
            <p>
                Each credit has its own unique point system. For some you may receive partial points for completing aspects of the credit, while others must be fully completed in order to receive any points. The worth of each credit varies from 1 point to 14 points. After the submission of the final report, these points are then tallied up in order to determine the rank/recognition of the institution.
            </p>
            <center><img src={require('../images/STARSpoints.png')} alt="Image of STARS awarded point values"/></center>


            <h3>How should the report be divided?</h3>
            <p>
                Each team member should be assigned a specific area to focus on (e.g. Academics, Operations), as well as which credits they will be responsible for (e.g. AC-1 - AC-6). Each of the four areas should have at least 1 student lead who will be in charge of checking in with the student researchers in their area. They will be mainly responsible for reviewing the data and narratives entered into the reporting tool and checking for accuracy and correct grammar. They would also be the other students’ first person of contact if issues arise and act as the liaison to the faculty supervisor. 
            </p>

            <h3>The difference between STARS 2.0 vs STARS 2.1?</h3>
            <p> 
                It is important to note that the STARS checklist/technical manual has been updated to a new version. Some differences that you may notice are differences in the number of credits required for each of the 4 sections, as well as changes in the information being asked of the University in the individual credits. There are entire credits of STARS 2.0 that are no longer present in STARS 2.1, and new credits that were not in the previous version of the checklist. Keep these changes in mind when referring to last year’s collected data. They may not match up with the same credit number in the STARS 2.1 version. 
            </p>

            <h3>History of STARS at SSU</h3>

            <p>
                The idea of completing SSU’s first ever STARS report was brought back after a group of 3 students, and the former STARS faculty advisor/supervisor Jeff Baldwin, returned from the AASHE Conference 2015 in Portland, Oregon. From there, 4 students and Professor Baldwin came up with a plan of how to go about the report. For the first year of the project, the 4 students created templates of each area’s credits, compiled contacts for the responsible parties for each area, recruited for the next team of students, and presented at a variety of conferences including This Way to Sustainability at CSU Chico and the Sustainable North Bay Youth Summit. 
                At the end of the 2014-15 academic year, 3 of the co-founding students graduated from SSU. At the start of the 2015-16 academic year, the remaining student, along with about 10 other students, voluntarily began collecting data for the STARS report. After countless hours of work and hundreds of emails, the group successfully completed SSU’s first STARS report and was the first, and only, student-led reporting campus in AASHE’s history. SSU received the Bronze Award with a total score of 34.80 points.
            </p>

            <h3> Main Challenges for the 2015-16 STARS Team </h3>
            <p>
                While the report was successfully completed, the road to the Bronze Award was not easy. Here are the main challenges that the previous team faced:

                <ul>
                    <li> Lack of responses to emails/Lack of participation by campus members</li>
                    <li>Remaining motivated through important times of the semester including midterms, breaks, and finals.</li>
                    <li> Meeting deadlines (specifically in relation to lack of responses) </li>
                    <li> Editing narratives/qualitative data </li>
                    <li> Finding appropriate/responsible parties for every credit </li>
                    <li> Receiving 0 points on some credits due to a lack of data</li>
                    <li> Knowing we may have received a higher rating/award if all campus data had been accessible and available to us </li>
                </ul>
            </p>


            <h3> Advice for Future STARS Teams </h3>
            <p>
                The STARS report has helped put Sonoma State University on the map as a “sustainable campus”. It is an honor to be a part of this effort, and the efficiency and achievements of this process can only improve. Here are some words of advice to future teams:
            </p>

            <ul>
                <li> Begin sending out emails as early in the semester as possible </li>
                <li> Collect all public data and place into the reporting tool first </li>
                <li> Do regular, or even weekly, check-ins with all team members </li>
                <li> Do not hesitate to send follow-up emails after two weeks of no response </li>
                <li> Try and evenly distribute the amount of work each person is responsible for </li>
                <li> If you are overwhelmed with your own work, communicate with your fellow teammates </li>

            </ul>

            <h3> Questions or Comments? </h3> 
            <h4> Claudia Sisomphou - Student Lead  </h4>
                <ul> <li>via Phone: 707-570-6573</li> <li>via Email: csisomphou@gmail.com</li></ul>
           

            <h4>Jeff Baldwin - Faculty Advisor/Supervisor</h4>
            <ul><li> via Email: jeffrey.baldwin@sonoma.edu </li> </ul> 


            <h4> Paul Draper - Director of Sustainability</h4>
            <ul> <li>via Email: paul.draper@sonoma.edu OR sustainablessu@sonoma.edu</li></ul>






            <br/><br/><br/>

             
            </div>
        )
    }
}
export default Home;

