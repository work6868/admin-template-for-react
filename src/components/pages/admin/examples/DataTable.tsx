import * as React from "react";
import * as intl from "react-intl-universal";
import { alert, confirm, loading } from "@bndynet/dialog";

import utils from "app/helpers/utils";
import { service as resourceService } from "app/service/resource";
import { DataTable, PageHeader, DataTableRequestParameters, DataTablePageMeta } from "app/ui";

class DataTableExample extends React.Component {
    private arrayData = [["Name", "Location", "Age", "Salary"], ["Andy1", "Hefei", 30, "$121,120"], ["Andy2", "Hefei", 33, "$121,110"], ["Andy3", "Hefei", 32, "$121,140"], ["Andy4", "Hefei", 35, "$121,130"], ["Andy5", "Hefei", 31, "$121,120"]];
    private objectData = [
        { name: "Joe James", company: "Test Corp", city: "Yonkers", state: "NY" },
        { name: "John Walsh", company: "Test Corp", city: "Hartford", state: "CT" },
        { name: "Bob Herm", company: "Test Corp", city: "Tampa", state: "FL" },
        { name: "James Houston", company: "Test Corp", city: "Dallas", state: "TX" },
        { name: "Joe James1", company: "Test Corp", city: "Yonkers", state: "NY" },
        { name: "John Walsh", company: "Test Corp", city: "Hartford", state: "CT" },
        { name: "Bob Herm", company: "Test Corp", city: "Tampa", state: "FL" },
        { name: "James Houston", company: "Test Corp", city: "Dallas", state: "TX" },
        { name: "Joe James2", company: "Test Corp", city: "Yonkers", state: "NY" },
        { name: "John Walsh", company: "Test Corp", city: "Hartford", state: "CT" },
        { name: "Bob Herm", company: "Test Corp", city: "Tampa", state: "FL" },
        { name: "James Houston", company: "Test Corp", city: "Dallas", state: "TX" },
    ];

    public constructor(props) {
        super(props);
    }

    public render() {
        return (
            <div>
                <PageHeader title="DataTable" />
                <DataTable title="Remote Data" dataPromise={this.tableDataPromise} scrollable={true} onRowClick={this.handleRowClick} onRowsDelete={this.handleRowsDelete} />
                <br />
                <DataTable title="Array Data" data={this.arrayData} pagination={false} onRowClick={this.handleRowClick} onRowsDelete={this.handleRowsDelete} selectable={false} />
                <br />
                <DataTable title="Object Data" data={this.objectData} onRowClick={this.handleRowClick} onRowsDelete={this.handleRowsDelete} selectable="single" />
                <br />
            </div>
        );
    }

    private handleRowClick(rowData: any) {
        alert(JSON.stringify(rowData));
    }

    private handleRowsDelete() {
        return confirm(intl.get("deleteConfirmMessage")).then(() => {
            // here to call api
            loading();
            setTimeout(() => {
                loading(false);
            }, 3000);
        });
    }

    private tableDataPromise(args: DataTableRequestParameters): Promise<DataTablePageMeta> {
        let url = "/datatable.json";
        if (args) {
            url += `?page=${args.page || 1}`;
            url += `&pageSize=${args.pageSize || 10}`;

            if (args.sort) {
                url += `&sort=${args.sort}&sortDirection=${args.sortDirection}`;
            }
            if (args.searchText) {
                url += `&search=${args.searchText}`;
            }
        }

        const ajax = resourceService.get(url).then((res: any) => {
            const result: DataTablePageMeta = {
                data: res,
                page: (args && args.page) || 1,
                count: 112,
            };
            return result;
        });

        return utils.deplay<DataTablePageMeta>(3, ajax);
        // return ajax;
    }
}

export default DataTableExample;
