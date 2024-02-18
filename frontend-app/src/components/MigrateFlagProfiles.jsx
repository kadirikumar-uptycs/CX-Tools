import React, { useState, createContext } from "react";
import { useSearchParams } from 'react-router-dom';
import TenantComponent from "./TenantComponent";
import './css/FlagProfiles.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import SnackBar from './SnackBar';
import DrawerComponent from "./Drawer";
import SelectComponent from './SelectComponent';
import ScrollToTopButton from "./ScrollComponent";


export const ContextProvider = createContext(null);

export default function MigrateFlagProfiles() {

    let [state, setState] = useState({
        ourceFileName: 'No File Choosen',
        targetFileName: 'No File Choosen',
        sourceCredentials: {},
        targetCredentials: {},
        sourceResources: [],
        targetResources: [],
        migrationList: []
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

    let [searchParams, ] = useSearchParams();
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

        }
        else {
            ele.innerHTML = `Migrate <i
            class="bi bi-send-arrow-up"></i>`;
        }
    }

    async function migrateResources(event) {

        // loading animation on the button
        toggleMigrateButton(event.target, 'loading', false);

        let resources = state.sourceResources.filter(resource => state.migrationList.includes(resource.id))
        let url = `http://localhost:17291/migrate/${resourceFromURL}`;

        // empty migration list, this causes diabling migration button while migration is in progess
        setState(prev => ({
            ...prev,
            migrationList: [],
        }));

        try {
            await axios.post(url, { resources, credentials: state.targetCredentials });
            toggleMigrateButton(event.target, 'done', false);
            await sleep(2000);
            toggleMigrateButton(event.target, 'reset', false);
            setSnackBar({
                open: true,
                message: 'Resources Migrated Successfully',
                severity: 'success',
                duration: 4500,
            });
        } catch (err) {
            console.log(err);
            toggleMigrateButton(event.target, 'done', true);
            await sleep(2000);
            toggleMigrateButton(event.target, 'reset', false);
            setSnackBar({
                open: true,
                message: 'Error Occured while migrating some of the resources',
                severity: 'error',
                duration: 4000,
            });
            await sleep(2000);
            setTimeout(() => {
                setDrawer({
                    open: true,
                    content: err.response.data.errorDetails,
                }, 2000);
            });

        }
    }

    return (
        <ContextProvider.Provider value={{ state, setState }}>
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
            <DrawerComponent getChildState={setDrawerState} />

            {/* Scroll To Top */}
            <ScrollToTopButton />
        </ContextProvider.Provider>
    )
}