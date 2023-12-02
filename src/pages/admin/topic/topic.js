import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import {requestGet} from '../../../services/request'

var token = localStorage.getItem('token');
var size =10;
var urlAll = ""
async function loadAllTopic(page, idSchoolYear){
    var url = 'http://localhost:8080/api/topic/public/findAll?size=' + size;
    if(idSchoolYear != null) {url+= "&id="+idSchoolYear}
    urlAll = url;
    url += '&page='+page; 
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    return response;
}


async function loadAllSchoolYear(){
    var url = 'http://localhost:8080/api/schoole-year/public/findAll';
    const response = await fetch(url, {
        method: 'GET'
    });
    return response;
}

async function confirmRequest(id){
    var url = 'http://localhost:8080/api/request-topic/admin/accept?id='+id;
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if(response.status < 300){
        toast.success("Thành công")
        await new Promise(resolve => setTimeout(resolve, 1500));
        window.location.reload();
    }
    else{
        if(response.status == 417){
            var result  = await response.json();
            toast.error(result.errorMessage)
        } 
        else{
            toast.error("Thất bại")
        }
    }
}

async function cancelRequest(id){
    var url = 'http://localhost:8080/api/request-topic/admin/cancel?id='+id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if(response.status < 300){
        toast.success("Thành công")
        await new Promise(resolve => setTimeout(resolve, 1500));
        window.location.reload();
    }
    else{
        if(response.status == 417){
            var result  = await response.json();
            toast.error(result.errorMessage)
        } 
        else{
            toast.error("Thất bại")
        }
    }
}

async function deleteRequest(id){
    var con = window.confirm("xác nhận xóa");
    if(con == false){return;}
    var url = 'http://localhost:8080/api/request-topic/admin/delete?id='+id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if(response.status < 300){
        toast.success("Thành công")
        await new Promise(resolve => setTimeout(resolve, 1500));
        window.location.reload();
    }
    else{
        if(response.status == 417){
            var result  = await response.json();
            toast.error(result.errorMessage)
        } 
        else{
            toast.error("Thất bại")
        }
    }
}

const AdminTopic = ()=>{
    const [items, setItems] = useState([]);
    const [itemRequest, setItemRequest] = useState([]);
    const [itemSchoolYear, setItemSchoolYear] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    useEffect(()=>{
        const getTopic = async(page) =>{
            const response = await loadAllTopic(page, null);
            var result = await response.json();
            var totalPage = result.totalPages;
            setItems(result.content)
            setpageCount(totalPage);
        };
        getTopic(0);

        const getSchoolYear = async() =>{
            var first = [{id:"",name:"Tất cả học kỳ"}]
            const response = await loadAllSchoolYear();
            var list = await response.json();
            setItemSchoolYear(first.concat(list));
        };
        getSchoolYear();
    }, []);

    async function loadRequest(id){
        const response = await requestGet('http://localhost:8080/api/request-topic/admin/findByTopic?id='+id);
        var list = await response.json();
        setItemRequest(list);
    }

    async function deleteTopic(id){
        var con = window.confirm("Xác nhận xóa đề tài này?")
        if (con == false) {
            return;
        }
        var url = 'http://localhost:8080/api/topic/admin/delete?id=' + id;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: new Headers({
                'Authorization': 'Bearer ' + token,
            })
        });
        if(response.status < 300){
            toast.success("Xóa thành công")
            await new Promise(resolve => setTimeout(resolve, 1500));
            window.location.reload();
        }
        else{
            if(response.status == 417){
                var result  = await response.json();
                toast.error(result.errorMessage)
            } 
            else{
                toast.error("Xóa thất bại")
            }
        }
    }

    async function loadAllTopicByUrl(page){
        const response = await fetch(urlAll+'&page='+page, {
            method: 'GET',
            headers: new Headers({
                'Authorization': 'Bearer ' + token,
            })
        });
        return response;
    }

    const fetchTopic = async (page) => {
        const res = await loadAllTopicByUrl(page);
        var result = await res.json();
        var totalPage = result.totalPages;
        setItems(result.content)
        setpageCount(totalPage);
        return result.content;
    };

    const handlePageClick = async (data)=>{
        var currentPage = data.selected
        const listClass = await fetchTopic(currentPage);
    }



    async function loadBySchoolYear(e){
        var id = e.id==""?null:e.id;
        const response = await loadAllTopic(0, id);
        var result = await response.json();
        console.log(result);
        var totalPage = result.totalPages;
        setItems(result.content)
        setpageCount(totalPage);
    }


    return (
        <div>
            <div class="col-sm-12 header-sp">
                    <div class="row">
                        <div className='col-3'>
                            <a href='add-topic' className='btn btn-primary'>Thêm đề tài</a>
                        </div>
                        <div className='col-md-4 col-sm-6 col-6'>
                            <Select
                            onChange={(item) => {
                                loadBySchoolYear(item);
                            }}
                            options={itemSchoolYear} 
                            getOptionLabel={(itemSchoolYear)=>itemSchoolYear.name} 
                            getOptionValue={(itemSchoolYear)=>itemSchoolYear.id}  
                            placeholder="Lọc theo học kỳ"/>
                        </div>
                    </div>
                </div>
                <div class="col-sm-12">
                    <div class="wrapper">
                        <table class="table table-striped tablefix">
                            <thead class="thead-tablefix">
                                <tr>
                                    <th>id</th>
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
                                        <td>{item.id}</td>
                                        <td>{item.schoolYear.name}</td>
                                        <td>{item.name}</td>
                                        <td>{item.description}</td>
                                        <td>{item.createdDate}</td>
                                        <td>{item.linkFile != null ? <a href={item.linkFile}>Xem file hướng dẫn</a>:""}</td>
                                        <td class="sticky-col">
                                            <a href={"add-topic?id="+item.id}><i className='fa fa-edit iconaction'></i></a>
                                            <i onClick={()=>deleteTopic(item.id)} className='fa fa-trash iconaction'></i>
                                            <i onClick={()=>loadRequest(item.id)} data-bs-toggle="modal" data-bs-target="#addschoolyear" className='fa fa-eye pointer'> Xem yêu cầu</i>
                                        </td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </div>
                    <ReactPaginate 
                    marginPagesDisplayed={2} 
                    pageCount={pageCount} 
                    onPageChange={handlePageClick}
                    containerClassName={'pagination'} 
                    pageClassName={'page-item'} 
                    pageLinkClassName={'page-link'}
                    previousClassName='page-item'
                    previousLinkClassName='page-link'
                    nextClassName='page-item'
                    nextLinkClassName='page-link'
                    breakClassName='page-item'
                    breakLinkClassName='page-link'  
                    activeClassName='active'/>
                </div>

            <div class="modal fade" id="addschoolyear" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Danh sách yêu cầu</h5> <button id='btnclosemodal' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                        <div class="modal-body row modalform">
                            <table class="table table-striped tablefix">
                                <thead class="thead-tablefix">
                                    <tr>
                                        <th>Chủ đề</th>
                                        <th>Ngày gửi</th>
                                        <th>Người gửi</th>
                                        <th class="sticky-col">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody id='listrequest'>
                                    {itemRequest.map(item=>{
                                        return <tr>
                                            <td>{item.topic.name}</td>
                                            <td>{item.createdDate}</td>
                                            <td>{item.person.fullname}<br/>{item.person.email}</td>
                                            <td class="sticky-col">
                                                {item.accept == true?
                                                <button onClick={()=>cancelRequest(item.id)} className='btn btn-danger'>Hủy</button>:
                                                <button onClick={()=>confirmRequest(item.id)} className='btn btn-primary'>Đồng ý</button>
                                                }
                                                {item.accept == true?"":
                                                <button onClick={()=>deleteRequest(item.id)} className='btn btn-danger'>Xóa</button>
                                                }
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
    );
}

export default AdminTopic;