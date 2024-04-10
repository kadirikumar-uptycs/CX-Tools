import React, { useState, createContext, useEffect } from "react";
import { useSearchParams } from 'react-router-dom';
import TenantComponent from "./TenantComponent";
import './css/MigrateResources.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import SnackBar from './SnackBar';
import DrawerComponent from "./Drawer";
import SelectComponent from './SelectComponent';
import ScrollToTopButton from "./ScrollComponent";
import HomeLink from "./Home-Link";
import config from "../config";
import resourcesList from "../resourcesList";

export const ContextProvider = createContext(null);

export default function MigrateResources() {

    let [state, setState] = useState({
        sourceFileName: 'No File Choosen',
        targetFileName: 'No File Choosen',
        sourceCredentials: {},
        targetCredentials: {},
        sourceResources: [],
        targetResources: [],
        migrationList: [],
        targetReload: false,
        noTargetDataFound: false,
    });

    const sleep = time => new Promise(res => setTimeout(res, time));

    let canMigrate = state.migrationList.length > 0;

    let setSnackBar, setDrawer;

    function setDrawerState(childStateSetter) {
        setDrawer = childStateSetter;
    }

    function setChildState(childStateSetter) {
        setSnackBar = childStateSetter;
    }

    let [searchParams,] = useSearchParams();
    let resourceFromURL = searchParams.get('resource') || 'flagProfiles';


    function toggleMigrateButton(ele, actionState, isError) {
        ele.innerHTML = '';

        if (actionState === "loading") {
            ele.innerHTML = `<span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
            <span role="status">Migrating...</span>`;
        } else if (actionState === "done") {
            if (isError) {
                ele.innerHTML = `Error<i class="bi bi-exclamation-octagon-fill ms-3 text-danger"></i>`
            }
            else {
                ele.innerHTML = `Success<i class="bi bi-patch-check-fill ms-3 text-success"></i>`
            }
        } else {
            ele.innerHTML = `Migrate <i
            class="bi bi-send-arrow-up"></i>`;
        }
    }

    async function migrateResources(event) {

        let ele = event.currentTarget;

        // loading animation on the button
        toggleMigrateButton(ele, 'loading', false);

        let resources = state.sourceResources.filter(resource => state.migrationList.includes(resource.id))
        let url = `${config.SERVER_BASE_ADDRESS}/migrate/${resourceFromURL}`;

        // empty migration list, this causes diabling migration button while migration is in progess
        setState(prev => ({
            ...prev,
            migrationList: [],
        }));

        try {
            await axios.post(url, { resources, sourceCredentials: state.sourceCredentials, targetCredentials: state.targetCredentials }, { withCredentials: true });
            toggleMigrateButton(ele, 'done', false);
            await sleep(2000);
            toggleMigrateButton(ele, 'reset', false);
            setState(prev => ({
                ...prev,
                targetReload: true,
            }));
            setSnackBar({
                open: true,
                message: 'Resources Migrated Successfully',
                severity: 'success',
                duration: 4500,
            });
        } catch (err) {
            console.log(err);
            toggleMigrateButton(ele, 'done', true);
            await sleep(500);
            toggleMigrateButton(ele, 'reset', false);
            let details = err?.response?.data?.details || {};
            if (details.length > 0 && details.failed < details.total) {
                setState(prev => ({
                    ...prev,
                    targetReload: true,
                }));
            }
            setSnackBar({
                open: true,
                message: 'Error Occured while migrating some of the resources',
                severity: 'error',
                duration: 4000,
            });
            await sleep(500);
            setTimeout(() => {
                setDrawer({
                    open: true,
                    content: err?.response?.data?.details || {},
                }, 2000);
            });

        }
    }

    useEffect(() => {
        document.title = resourcesList?.filter(obj => obj.endpoint === resourceFromURL)[0]?.name || resourceFromURL;
    }, [resourceFromURL])

    return (
        <ContextProvider.Provider value={{ state, setState }}>
            <HomeLink />
            <SelectComponent />
            <section id="container">
                <TenantComponent type='source' />
                <div id="transfer-button" className="position-fixed d-flex flex-column" style={{ marginTop: "49vh" }}>
                    <button type="button"
                        className="btn btn-outline-info p-3"
                        id="migrate-button"
                        disabled={!canMigrate}
                        onClick={migrateResources}
                    >Migrate
                        {' '}<i className="bi bi-send-arrow-up"></i></button>
                </div>
                <TenantComponent type='target' />
            </section>

            {/* SnackBar */}
            <SnackBar getChildState={setChildState} />

            {/* Drawer */}
            <DrawerComponent passChildStateSetter={setDrawerState} />

            {/* Scroll To Top */}
            <ScrollToTopButton />
        </ContextProvider.Provider>
    )
}