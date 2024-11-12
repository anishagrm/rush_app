import React, { useEffect, useState } from 'react'
import axios from 'axios';

import { authMiddleWare } from '../util/auth';
import { LinearProgress } from '@material-ui/core';

export default function BrothersList(props) {

    const [loading, setLoading] = useState(true)
    const [brothers, setBrothers] = useState()

    const getRusheeSurveys = () => {

        authMiddleWare(props.history).then(() => {
            axios
                .get('/rusheeDetail', {
                    params: {
                        "rusheeGTID": props.rushee.gtid,
                    }
                })
                .then((response) => {
                    if (response.data) {

                        const surveys = response.data.surveys
                        const brothersFetched = []

                        for (var k = 0; k < surveys.length; k++) {
                            var survey = surveys[k]
                            if (!survey.survey.anonymous) {
                                if (!brothersFetched.includes(survey.brotherName)) {
                                    brothersFetched.push(survey.brotherName)
                                }
                            }
                        }

                        setBrothers(brothersFetched)
                        console.log(brothers)
                        setLoading(false)

                    }
                })
                .catch((err) => {
                    console.log(err);
                    // TODO handle errors better
                    props.history.push('/login')
                });
        });
    }

    useEffect(() => {

        if (loading) {
            getRusheeSurveys()
        }

    })

    return (

        <div>
            {loading ? <LinearProgress /> : <div>

                <h1>Brothers who can speak:</h1>

                {brothers.map(function(name){

                    return (
                        <h1>{name}</h1>
                    )

                })}

            </div>}
        </div>

    )

}