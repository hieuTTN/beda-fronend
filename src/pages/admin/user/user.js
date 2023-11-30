import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminUser = ()=>{

    return (
        <div>
            <div class="col-sm-12 header-sp">
                    <div class="row">
                        <div class="col-md-3 col-sm-6 col-6">
                            <label class="lb-form">Chọn quyền</label>
                            <select id="role" class="form-control">
                                <option value="">Tất cả quyền</option>
                                <option value="ROLE_ADMIN">Tài khoản admin</option>
                                <option value="ROLE_TEACHER">Tài khoản giảng viên</option>
                                <option value="ROLE_EMPLOYEE">Tài khoản nhân viên</option>
                                <option value="ROLE_STUDENT">Tài khoản sinh viên</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-sm-12">
                    <div class="wrapper">
                        <table class="table table-striped tablefix">
                            <thead class="thead-tablefix">
                                <tr>
                                    <th>id</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Ngày tạo</th>
                                    <th>Quyền</th>
                                    <th class="sticky-col">Khóa</th>
                                </tr>
                            </thead>
                            <tbody id="listuser">
                            </tbody>
                        </table>
                    </div>
                </div>


        </div>
    );
}

export default AdminUser;