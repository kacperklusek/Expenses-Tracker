import React, { useState } from 'react'
import { CardContent, Card, Divider, Tabs, Tab, Grid } from '@material-ui/core'

import useStyles from './styles'
import Details from '../Details/Details'
// import { Details } from '@material-ui/icons'

const DetailWrapper = () => {
    const classes = useStyles()
    const [tab, changeTab] = useState(0)

    return (
        <div>
            <Card>
                <CardContent>
                    <Tabs
                        variant='fullWidth'
                        value={tab}
                        textColor='primary'
                        indicatorColor='primary'
                        onChange={(event, newValue) => {
                            changeTab(newValue);
                        }}
                    >
                        <Tab label="Income"/>
                        <Tab label="Expense"/>
                    </Tabs>
                    {tab === 0 ?
                    <Details title="Income" /> 
                        :
                    <Details title="Expense" />}
                </CardContent>
            </Card>
        </div>

    )
}

export default DetailWrapper