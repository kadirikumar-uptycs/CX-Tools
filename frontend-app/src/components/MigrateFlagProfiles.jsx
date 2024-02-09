import React from "react";
import TenantComponent from "./TenantComponent";
import './css/FlagProfiles.css';
import "bootstrap-icons/font/bootstrap-icons.css";


export default function MigrateFlagProfiles() {
    return (
        <section id="container">
            <TenantComponent type='source'/>
            <div id="transfer-button" className="position-fixed d-flex flex-column" style={{marginTop: "49vh"}}>
                <button type="button" className="btn btn-outline-info p-3" id="migrate-button" disabled>Migrate
                    {' '}<i className="bi bi-send-arrow-up"></i></button>
            </div>
            <TenantComponent type='target'/>
        </section>
    )
}