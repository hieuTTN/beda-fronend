import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import {requestGet} from '../../../services/request'

var token = localStorage.getItem('token');



var idTopicSelect = null;
const MyTopic = ()=>{
    const [items, setItems] = useState([]);
    const [itemTopicPerson, setItemTopicPerson] = useState([]);
    const [itemStudent, setItemStudent] = useState([]);
    const [student, setStudent] = useState(null);
    const [leader, setLeader] = useState(false);
    useEffect(()=>{
        const getTopic = async() =>{
            const response = await requestGet('http://localhost:8080/api/topic-person/student/MyTopicPerson');
            var list = await response.json();
            setItems(list)
        };
        getTopic();
        const getStudent = async() =>{
            const response = await requestGet('http://localhost:8080/api/person/student/all-student');
            var list = await response.json();
            setItemStudent(list)
        };
        getStudent();
    }, []);
    var user = JSON.parse(window.localStorage.getItem('user'));
    const getTopicPerson = async(idTopic) =>{
        const response = await requestGet('http://localhost:8080/api/topic-person/student/findByTopic?id='+idTopic);
        var list = await response.json();
        setItemTopicPerson(list)
        idTopicSelect = idTopic;
        for(var i=0; i<list.length; i++){
            if(list[i].person.user.username == user.username && list[i].leader == true){
                setLeader(true);
            }
        }
    };
    console.log(leader);

    async function addMember(){
        var con = window.confirm("Xác nhận thêm thành viên vào nhóm");
        if(con == false){return;}
        const payload = { 
            leader:false,
            person:{
                id:student.id
            },
            topic:{
                id:idTopicSelect
            },
        }
        var url = 'http://localhost:8080/api/topic-person/student/create'
        const response = await fetch(url, {
            method: 'POST',
            headers: new Headers({
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(payload)
        });
        if (response.status < 300) {
            toast.success("Thêm hành công");
            getTopicPerson(idTopicSelect);
        }
        else {
            if(response.status == 417){
                var result  = await response.json();
                toast.error(result.errorMessage)
            } 
            else{
                toast.error("Thất bại")
            }
        }
    }

    async function deleteMember(id){
        var con = window.confirm("Xác nhận xóa thành viên");
        if(con == false){return;}
        var url = 'http://localhost:8080/api/topic-person/student/delete?id='+id
        const response = await fetch(url, {
            method: 'DELETE',
            headers: new Headers({
                'Authorization': 'Bearer ' + token,
            })
        });
        if (response.status < 300) {
            toast.success("Thành công");
            getTopicPerson(idTopicSelect);
        }
        else {
            toast.warning("Thất bại");
        }
    }

    return (
        <div>
            <div class="col-sm-12 header-sp">
                    <div class="row">
                        <div className='col-md-4 col-sm-6 col-6'>
                            <h4>Danh sách đề tài đã đăng ký</h4>
                        </div>
                    </div>
                </div>
                <div class="col-sm-12">
                    <div class="wrapper">
                        <table class="table table-striped tablefix">
                            <thead class="thead-tablefix">
                                <tr>
                                    <th>Học kỳ</th>
                                    <th>Tên đề tài</th>
                                    <th>Mô tả</th>
                                    <th>Cập nhật</th>
                                    <th>File hướng dẫn</th>
                                    <th class="sticky-col">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item=>{
                                    return <tr>
                                        <td>{item.topic.schoolYear.currentYear==true?<span className='text-green'>{item.topic.schoolYear.name}</span>:item.topic.schoolYear.name}</td>
                                        <td>{item.topic.name}</td>
                                        <td>{item.topic.description}</td>
                                        <td>{item.topic.createdDate}</td>
                                        <td>{item.topic.linkFile != null ? <a href={item.topic.linkFile}>Xem file hướng dẫn</a>:""}</td>
                                        <td class="sticky-col">
                                            <i onClick={()=>getTopicPerson(item.topic.id)} data-bs-toggle="modal" data-bs-target="#membermodal" className='fa fa-users pointer'> Thành viên</i>
                                            <i data-bs-toggle="modal" data-bs-target="#contentdiv" className='fa fa-file pointer'> Báo cáo</i>
                                        </td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

            <div class="modal fade" id="contentdiv" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Nội dung đề tài</h5> <button id='btnclosemodal' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                        <div class="modal-body row">
                            <div id='contenttopic'>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal fade" id="membermodal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Danh sách thành viên</h5> <button id='btnclosemodal' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                        <div class="modal-body row">
                            <div className='paddingmodal'>
                                <div className='row'>
                                    <div className='col-5'>
                                        <Select
                                        onChange={(item) => {
                                            setStudent(item);
                                        }}
                                        options={itemStudent} 
                                        getOptionLabel={(itemStudent)=>"MSV: "+itemStudent.code+", email: "+itemStudent.email+", "+ itemStudent.fullname} 
                                        getOptionValue={(itemStudent)=>itemStudent.id}  
                                        placeholder="Chọn sinh viên"/>
                                    </div>
                                    <div className='col-3'>
                                        <button onClick={()=>addMember()} className='btn btn-primary'>Thêm sinh viên</button>
                                    </div>
                                </div>
                                <table class="table table-striped tablefix">
                                    <thead class="thead-tablefix">
                                        <tr>
                                            <th>Mã sinh viên</th>
                                            <th>Họ tên</th>
                                            <th>Email</th>
                                            <th>Số điện thoại</th>
                                            <th>Lớp</th>
                                            <th class="sticky-col">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {itemTopicPerson.map(itemTopicPerson=>{
                                            return <tr>
                                                <td>{itemTopicPerson.person.code}</td>
                                                <td>{itemTopicPerson.person.fullname}</td>
                                                <td>{itemTopicPerson.person.email}</td>
                                                <td>{itemTopicPerson.person.phone}</td>
                                                <td>{itemTopicPerson.person.classes== null?"":itemTopicPerson.person.classes.name}</td>
                                                <td class="sticky-col">
                                                    {leader==true&& itemTopicPerson.person.user.username != user.username?
                                                    <i onClick={()=>deleteMember(itemTopicPerson.id)} className='fa fa-trash iconaction'></i>:""}
                                                </td>
                                            </tr>
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default MyTopic;