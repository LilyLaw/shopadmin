<template>
	<div>
		<PageTitle :pagetitle='pageTitle'></PageTitle>
		<ul class="lll-eproduct-form">
			<li>
				<label for="">名称：</label>
				<input type="text" v-model="pData.product_name">
			</li>
			<li>
				<label for="">价格：</label>
				<input type="number" v-model="pData.product_price">
			</li>
			<li class="lll-e-f-radio">
				<label for="">状态：</label>
				<span><input type="radio" value="1" v-model="pData.product_status"> 上架</span>
				<span><input type="radio" value="0" v-model="pData.product_status"> 下架</span>
			</li>
			<li class="lll-e-f-img">
				<label for="">图片：</label>
				<div class="images">
					<div class="e-image" v-for="(item,index) of productImg" :key="index">
						<img :src="item" alt="产品图片" />
						<i class="icon iconfont iconerror" @click="deleteImg(index)"></i>
					</div>
					<div class="upload">
						<input type="file" accept=".png, .jpg, .jpeg" @change="uploadImg" multiple>
						<i class="icon iconfont iconicon-test"></i><span>上传</span>
					</div>
				</div>
			</li>
			<li class="lll-e-f-desc">
				<label for="">详情：</label>
				<froala :tag="'textarea'" :config="config" v-model="pData.product_description"></froala>
			</li>
			<li>
				<label for=""></label>
				<input type="text" hidden="hidden" v-model="pData._id">
				<input type="submit" @click="submitData">
			</li>
		</ul>
	</div>
</template>

<script>
	import basicConfig from '../basicconfig.js';
	import axios from 'axios';
	import PageTitle from './common/pagetitle.vue';
	
	axios.defaults.withCredentials = true;
	
	export default {
		name: 'Eproduct',
		data: function(){
			return {
				pageTitle:'',
				pData: {
					_id:0,
					product_description:'',
					product_name:'',
					product_price:'',
					product_status:1,
					product_images: []
				},
				productImg:[],
				config: {
					placeholderText: 'Edit Your Product Description Here!',
					imageUploadURL: `${basicConfig.apihost}uploadEditorImg`,
					videoUploadURL: `${basicConfig.apihost}uploadEditorVideo`,
					events: {
						// 'initialized': function () { window.console.log(this.html.get()); }
					}
				}
			}
		},
		methods:{
			submitData(){
				this.checkValue(); //1. 先检测必填项
				let fd = new FormData();
				fd.append('_id',this.pData._id);
				fd.append('product_description',this.pData.product_description);
				fd.append('product_name',this.pData.product_name);
				fd.append('product_price',this.pData.product_price);
				fd.append('product_status',this.pData.product_status);
				for(let i=0; i<this.pData.product_images.length; i++){
					if(this.pData.product_images[i]._id){
						fd.append('product_images',this.pData.product_images[i]._id);
					}else{
						fd.append('product_images',this.pData.product_images[i]);
					}
				}
				axios.post(`${basicConfig.apihost}addproduct`,fd).then(function(res){
					if(res.status===200){ //操作成功
						alert('Success!');
					}
				}).catch(function(err){ throw err; });
			},
			checkValue(){
				this.pData.product_name = this.pData.product_name.trim();
			},
			uploadImg(e){
				let files = e.target.files;
				let reg = /jpg|jpeg|png/g;
				for(let i = 0; i<files.length; i++){
					if(reg.test(files[i].type)){
						let tmpurl = this.getImgUrl(files[i]);
						if(!this.pData.product_images){
							this.pData.product_images = [];
						}
						this.productImg.push(tmpurl);
						this.pData.product_images.push(files[i]);
					}
				}
			},
			getImgUrl(file){	// 构造图片url
				let url = null;
				if(window.createObjectURL !== undefined){
					url = window.createObjectURL(file);
				}else if(window.URL.createObjectURL !== undefined){
					url = window.URL.createObjectURL(file);
				}else if(window.webkitURL !== undefined){
					url = window.webkitURL.createObjectURL(file);
				}
				return url;
			},
			deleteImg(index){
				this.productImg.splice(index,1); // 删除渲染中的那个
				this.pData.product_images.splice(index,1); // 删除要传输到接口中的那个
			}
		},
		created:function(){
			if(this.$route.params.id){
				this.pageTitle = '修改产品';
				let pid = this.$route.params.id;
				axios.get(`${basicConfig.apihost}product/${pid}`).then((res)=>{
					this.pData = res.data;
					res.data.product_images.map((item)=>{
						this.productImg.push(`${basicConfig.apihost}${item.product_imgurl}`);
					})
				}).catch((err)=>{ throw err; });
			}else{
				this.pageTitle = '新增产品';
			}
		},
		components:{ PageTitle }
	}
</script>

<style scoped lang="less">
	@import './common/commonVariable.less';
	@import './common/common.less';
	ul.lll-eproduct-form{
		margin-top: 2rem;
		padding: 1rem;
		border: 1px solid #f0f0f0;
		min-width: 37.5rem;
		li{
			display: flex;
			align-items: center;
			padding: 0.7rem 0;
			label{
				width: 30%;
				min-width: 5rem;
				max-width: 8rem;
				text-align: right;
			}
			input[type='text'],input[type='number']{
				width: 70%;
				min-width: 25rem;
				max-width: 37.5rem;
			}
			&.lll-e-f-img{
				.images{
					> * {
						margin: 0.3rem;
					}
					> .e-image{
						width: 9.5rem;
						height: auto;
						position: relative;
						> img{
							width: 100%;
							height: auto;
						}
						> i{
							position: absolute;
							top: -0.5rem;
							right: -0.5rem;
							font-size: 1.2rem;
							cursor: pointer;
						}
					}
					display: flex;
					flex-wrap: wrap;
					.upload{
						width: 9.5rem;
						height: 9.5rem;
						border: 1px dashed @lllbordercolor;
						border-radius: @borderradius;
						background: #f8f8f8;
						cursor: pointer;
						.allcenter;
						flex-direction: column;
						position: relative;
						input[type="file"]{
							display: block;
							width: 100%;
							height: 100%;
							position: absolute;
							z-index: 10;
							opacity: 0;
						}
						i{
							font-size: 2rem;
						}
						&:hover{
							border-color: @lllblue;
						}
					}
				}
			}
			&.lll-e-f-radio{
				input{
					width: 20px;
				}
			}
			&.lll-e-f-desc,&.lll-e-f-img{
				label{
					align-self: flex-start;
				}
			}
		}
	}
</style>
