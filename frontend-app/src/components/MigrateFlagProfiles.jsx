import React, { useState, createContext } from "react";
import TenantComponent from "./TenantComponent";
import './css/FlagProfiles.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import SnackBar from './SnackBar';
import DrawerComponent from "./Drawer";


export const ContextProvider = createContext(null);

export default function MigrateFlagProfiles() {

    let [migrationList, setMigrationList] = useState([]);
    let [resourceData, setResourceData] = useState({ 'source': [], 'target': [] });
    let [allCredentials, setAllCredentials] = useState({ 'source': {}, 'target': {} })
    let canMigrate = migrationList.length > 0;

    let setSnackBar, setDrawer;

    function setDrawerState(childStateSetter) {
        setDrawer = childStateSetter;
    }

    function setChildState(childStateSetter) {
        setSnackBar = childStateSetter;
    }

    function toggleMigrateButton(ele, type, isError) {
        ele.innerHTML = '';

        if (type === "loading") {
            ele.innerHTML = `<span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
            <span role="status">Migrating...</span>`;
        } else if (type === "done") {
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

        let resources = resourceData.source.filter(resource => migrationList.includes(resource.id))
        let url = 'http://localhost:17291/migrateFlagProfiles';

        // empty migration list, this causes diabling migration button while migration is in progess
        setMigrationList([]);

        try {
            await axios.post(url, { resources, credentials: allCredentials['target'] });
            toggleMigrateButton(event.target, 'done', false);
            setTimeout(() => {
                toggleMigrateButton(event.target, 'reset', false);
            }, 2000);
            setSnackBar({
                open: true,
                message: 'Resources Migrated Successfully',
                severity: 'success',
                duration: 4500,
            });
        } catch (err) {
            console.log(err);
            toggleMigrateButton(event.target, 'done', true);
            setTimeout(() => {
                toggleMigrateButton(event.target, 'reset', false);
            }, 2000);
            setSnackBar({
                open: true,
                message: 'Error Occured while migrating some of the resources',
                severity: 'error',
                duration: 2000,
            });
            setTimeout(() => {

                setDrawer({
                    open: true,
                    content: err.response.data.errorDetails,
                }, 2000);
            });

        }
    }

    return (
        <ContextProvider.Provider value={{ migrationList, setMigrationList, resourceData, setResourceData, allCredentials, setAllCredentials }}>
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
        </ContextProvider.Provider>
    )
}