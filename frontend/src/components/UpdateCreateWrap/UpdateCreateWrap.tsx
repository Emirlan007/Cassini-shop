// import {Navigate, useParams} from "react-router-dom";
// import UpdateProduct from "../../features/products/UpdateProduct.tsx";
// import {useEffect} from "react";
// import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
// import {fetchProductById, updateProduct} from "../../features/products/productsThunks.ts";
// import {selectProduct} from "../../features/products/productsSlice.ts";
// import type {ProductInput} from "../../types";
// import {selectUser} from "../../features/users/usersSlice.ts";
//
// const UpdateCreateWrap = () => {
//     const params = useParams();
//     const dispatch = useAppDispatch();
//     const product = useAppSelector(selectProduct);
//     const user = useAppSelector(selectUser);
//
//     useEffect(() => {
//         if (params && params.productUpdate) {
//             dispatch(fetchProductById(params.productUpdate));
//         }
//     }, [params, dispatch]);
//
//     const onSubmit = async (product: ProductInput) => {
//         if (params.productUpdate) {
//             await dispatch(updateProduct({product: product, _productId: params.productUpdate}));
//             await dispatch(fetchProductById(params.productUpdate))
//         }
//     }
//
//     return (
//         <>
//             {
//                 user?.role !== "admin" ? (
//                     <Navigate to="/" />
//                 ) : (
//                     product && <UpdateProduct onSubmit={onSubmit} product={product} />
//                 )
//             }
//
//         </>
//     );
// };
//
// export default UpdateCreateWrap;
// needs to be checked