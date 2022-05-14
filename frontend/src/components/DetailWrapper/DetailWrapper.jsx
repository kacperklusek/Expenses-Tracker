import React, { useState } from 'react'
import { CardContent, Card, Tabs, Tab } from '@material-ui/core'

import Details from '../Details/Details'
// import { Details } from '@material-ui/icons'

const DetailWrapper = () => {
    const [tab, changeTab] = useState(0)

    return (
        <Card style={{minWidth: '348px'}}>
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
    )
}

export default DetailWrapper