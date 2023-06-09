import Head from 'next/head'
import {Container, Tab, Tabs} from "@mui/material";
import {useState} from "react";
import GettingStartedList from "@/components/GettingStarted/GettingStartedList";

const TAB_ENUM = {
    GETTING_STARTED: "GETTING_STARTED"
}

const tabs = [
    {value: TAB_ENUM.GETTING_STARTED, label: 'Getting started'},
    {value: 1, label: 'Test'}
]

export default function Home() {
    const [tab, setTab] = useState(TAB_ENUM.GETTING_STARTED)
    const createTabs = () => tabs.map((tab, index) => <Tab key={index} value={tab.value} label={tab.label}/>)
    return (
        <>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <Container sx={{width: '100%', height: '100vh'}}>
                <Tabs
                    sx={{width: '100%'}}
                    value={tab}
                    onChange={(_, value) => setTab(value)}
                    centered
                    indicatorColor="primary"
                >
                    {createTabs()}
                </Tabs>
                {/*<Login/>*/}
                {tab === TAB_ENUM.GETTING_STARTED && <GettingStartedList/>}
            </Container>
        </>
    )
}
