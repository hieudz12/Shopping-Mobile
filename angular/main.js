var app = angular.module('myapp', ['ngRoute']);

app.controller('myctrl', function ($rootScope, $http) {
    /* cách 2 mệnh kim */
    $rootScope.listSp = [];
    $http.get('angular/product.json').then(function (response) {
        $rootScope.listSp = response.data;
    });

    $rootScope.posts = [];
    $rootScope.newProduct = {id: 0, img: '', name:'', price:0, discount:0};
    $http.get('http://localhost:3000/posts').then(function (response) {
        $rootScope.posts = response.data;
    })

    /* thêm sản phẩm vào json server */
    $rootScope.submit = -1;

    $rootScope.addJson = function (event) {
        event.preventDefault();
    
        if ($rootScope.submit === -1) {
            // Thêm sản phẩm mới
            $http.post("http://localhost:3000/posts", $rootScope.newProduct).then(function (response) {
                $rootScope.posts.push(response.data); // Thêm sản phẩm mới từ phản hồi của máy chủ
            });
        } else {
            // Cập nhật sản phẩm đã tồn tại
            $http.put('http://localhost:3000/posts/' + $rootScope.newProduct.id, $rootScope.newProduct).then(function (response) {
                // Tìm chỉ mục của sản phẩm trong mảng $rootScope.posts
                const index = $rootScope.posts.findIndex(p => p.id === $rootScope.newProduct.id);
                
                if (index !== -1) {
                    // Cập nhật thông tin sản phẩm trong mảng $rootScope.posts
                    $rootScope.posts.splice(index, 1, response.data);
                }
            });
            
            $rootScope.submit = -1;
        }
    
        // Xóa form sau khi thêm hoặc cập nhật
        $rootScope.clear(event);
    };
    

  

    $rootScope.sua = function(event, index){
        event.preventDefault()
        $rootScope.newProduct =  $rootScope.posts[index]
        // update vị trí của sản phẩm trong mảng 
        $rootScope.submit = index;
    }

    $rootScope.delete = function (index, productId) {
        // Delete from local array
        $rootScope.posts.splice(index, 1);
    
        // Delete from JSON server
        $http.delete('http://localhost:3000/posts/' + productId).then(function (response) {
            console.log('Product deleted from JSON server');
        }).catch(function (error) {
            console.error('Error deleting product from JSON server:', error);
        });
    };
    
    
   

    $rootScope.clear = function(event){
        event.preventDefault()
        $rootScope.submit = -1;
        $rootScope.newProduct={
            name:'',
            price:0,
            discount: 0,
            img: '',
            id:''
        }
    }
    

   
    

    /* edit */
    $rootScope.editProduct = function (product) {
        $rootScope.newProduct.id = product.id;
        $rootScope.newProduct.img = product.img;
        $rootScope.newProduct.name = product.name;
        $rootScope.newProduct.price = product.price;
        $rootScope.newProduct.discount = product.discount;
    };

   








    /* add to cart */
    $rootScope.CartLocal = [];
    $rootScope.addToCart = function (item) {
        var index = $rootScope.CartLocal.findIndex(p => p.id == item.id);
        if (index >= 0) {
            $rootScope.CartLocal[index].quantity++;
        } else {
            var spInCart = { id: item.id, img: item.img, name: item.name, price: item.price, quantity: 1 }
            $rootScope.CartLocal.push(spInCart);
        }
        console.log($rootScope.CartLocal)
    }

    $rootScope.cacPhiKhac = 30;
    $rootScope.phiGiaoHang = 40;

    /* tăng giảm số lượng sản phẩm trong giỏ hàng */

    $rootScope.minus = function (item) {
        if (item.quantity > 1) {
            item.quantity--;
        }
    }

    $rootScope.plus = function (item) {
        item.quantity++;
    }

    /* tổng số lượng sản phẩm có trong giỏ hàng */
    $rootScope.sumCart = function () {
        var tsl = 0;
        for (i = 0; i < $rootScope.CartLocal.length; i++) {
            tsl += $rootScope.CartLocal[i].quantity;
        }
        return tsl;
    }

    /* tổng số lượng sản phẩm có trong giỏ hàng */
    $rootScope.sumMoney = function () {
        var tt = 0;
        for (i = 0; i < $rootScope.CartLocal.length; i++) {
            tt += $rootScope.CartLocal[i].quantity * $rootScope.CartLocal[i].price;
        }
        return tt;
    }

    /* xóa sản phẩm */
    $rootScope.deletes = function (index) {
        $rootScope.CartLocal.splice(index, 1);
    }



    $rootScope.prop = 'price';
    $rootScope.reverseSort = false; // Default sorting order

    $rootScope.sortBy = function (prop, reverse) {
        $rootScope.prop = prop;
        $rootScope.reverseSort = reverse;
    }

    /* sort */
    $rootScope.setSortOrder = function (field, reverse) {
        if (field === 'name') {
            $rootScope.sortOrder = $rootScope.firstLetter;
        } else {
            $rootScope.sortOrder = field;
        }
        $rootScope.reverseSort = reverse;
    };

    /* phân trang */
    $rootScope.pageSize = 3; // Số sản phẩm trên mỗi trang
    $rootScope.currentPage = 1; // Trang hiện tại

    $rootScope.begin = ($rootScope.currentPage - 1) * $rootScope.pageSize;

    $rootScope.repaginate = function () {
        $rootScope.begin = ($rootScope.currentPage - 1) * $rootScope.pageSize;
    };

    // Thêm các hàm điều khiển phân trang
    $rootScope.first = function () {
        $rootScope.currentPage = 1;
        $rootScope.repaginate();
    };

    $rootScope.prev = function () {
        if ($rootScope.currentPage > 1) {
            $rootScope.currentPage--;
            $rootScope.repaginate();
        }
    };

    $rootScope.next = function () {
        if ($rootScope.currentPage < $rootScope.pageCount()) {
            $rootScope.currentPage++;
            $rootScope.repaginate();
        }
    };

    $rootScope.last = function () {
        $rootScope.currentPage = $rootScope.pageCount();
        $rootScope.repaginate();
    };

    $rootScope.pageCount = function () {
        return Math.ceil($rootScope.CartLocal.length / $rootScope.pageSize);
    };








    $rootScope.products = [
        /* sale 1 */
        {
            img: 'Images/1.webp',
            name: 'Vòng Thạch Anh Mắt Hổ vàng nâu 12mm Tỳ Hưu bạc mạ vàng',
            price: 74000,
            discount: 999.000
        },
        {
            img: 'Images/2.webp',
            name: 'Dây chuyền bạc thái',
            price: 1700000,
            discount: 1999000
        },
        {
            img: 'Images/3.webp',
            name: 'Dây chuyền bạc thái',
            price: 540000,
            discount: 790000
        },
        {
            img: 'Images/4.webp',
            name: 'Vòng Thạch Anh Mắt Hổ vàng nâu 12mm Tỳ Hưu bạc mạ vàng',
            price: 990000,
            discount: 1999000
        }
    ]

    /* 2 */
    $rootScope.products1 = [
        /* sale 1 */
        {
            img: 'Images/5.webp',
            name: 'Vòng Hổ Phách Baltic cognac vàng 18mm',
            price: 174000,
            discount: 2999000
        },
        {
            img: 'Images/6.webp',
            name: 'Vòng kiềng Ruby Nam Phi cao cấp ni 52',
            price: 3400000,
            discount: 1999000
        },
        {
            img: 'Images/7.webp',
            name: 'Vòng tay đá Thạch Anh Đen Morion Quartz 10mm cao cấp',
            price: 540000,
            discount: 790000
        },
        {
            img: 'Images/8.webp',
            name: 'Vòng Ngọc Cẩm Thạch xanh sơn thủy 10mm',
            price: 990000,
            discount: 1999000
        }
    ]

    $rootScope.products12 = [
        {
            img: 'Images/7.webp',
            name: 'Vòng tay đá Thạch Anh Đen Morion Quartz 10mm cao cấp',
            price: 540000,
            discount: 790000
        },
        {
            img: 'Images/8.webp',
            name: 'Vòng Ngọc Cẩm Thạch xanh sơn thủy 10mm',
            price: 990000,
            discount: 1999000
        },
        {
            img: 'Images/17.webp',
            name: ' Vòng đá Diopside 10mm cao cấp chuẩn 6A',
            price: 540000,
            discount: 790000
        },
        {
            img: 'Images/18.webp',
            name: 'Vòng Ngọc Cẩm Thạch xanh sơn thủy 10mm',
            price: 990000,
            discount: 1999000
        }
    ]

    /* menh kim */

    /* cách 1 */
    /*  $rootScope.kim = [
       {
           img: 'Images/MK1.webp',
           name: 'Nhẫn bạc đính đá Thạch Anh Vàng Citrine 8mm',
           price: 540000,
           discount: 790000
       },
       {
           img: 'Images/MK2.webp',
           name: 'Vòng Ngọc Cẩm Thạch xanh sơn thủy 10mm',
           price: 990000,
           discount: 1999000
       },
       {
           img: 'Images/MK3.webp',
           name: ' Vòng đá Diopside 10mm cao cấp chuẩn 6A',
           price: 540000,
           discount: 790000
       },
       {
           img: 'Images/MK4.webp',
           name: 'Vòng Ngọc Cẩm Thạch xanh sơn thủy 10mm',
           price: 990000,
           discount: 1999000
       }   
     ] */


    $rootScope.kim1 = [
        {
            img: 'Images/MK5.webp',
            name: 'Vòng Hổ Phách mật lạp 17mm',
            price: 540000,
            discount: 790000
        },
        {
            img: 'Images/MK6.webp',
            name: 'Vòng Ngọc Cẩm Thạch xanh sơn thủy 10mm',
            price: 990000,
            discount: 1999000
        },
        {
            img: 'Images/MK7.webp',
            name: ' Vòng đá Diopside 10mm cao cấp chuẩn 6A',
            price: 540000,
            discount: 790000
        },
        {
            img: 'Images/MK8.webp',
            name: 'Vòng Ngọc Cẩm Thạch xanh sơn thủy 10mm',
            price: 990000,
            discount: 1999000
        }
    ]

    /* menh mộc */
    $rootScope.moc = [
        {
            img: 'Images/MM1.webp',
            name: 'Mặt đá Aquamarine cao cấp chuẩn 8A 17mm',
            price: 140000,
            discount: 790000
        },
        {
            img: 'Images/MM2.webp',
            name: 'Vòng vàng Cẩm Thạch xanh sơn thủy 10mm',
            price: 9980000,
            discount: 1999000
        },
        {
            img: 'Images/MM3.webp',
            name: ' Vòng đá Diopside 100mm chuẩn 6A',
            price: 990000,
            discount: 340000
        },
        {
            img: 'Images/MM4.webp',
            name: 'Vòng Ngọc Cẩm Thạch  đỏ đô thủy 10mm',
            price: 9790000,
            discount: 19799000
        }
    ]

    $rootScope.moc1 = [
        {
            img: 'Images/MM5.webp',
            name: 'Vòng Hổ Phách mật lạp 17mm',
            price: 5240000,
            discount: 1790000
        },
        {
            img: 'Images/MM6.webp',
            name: 'Vòng Ngọc Cẩm Thạch xanh sơn thủy 10mm',
            price: 4990000,
            discount: 21999000
        },
        {
            img: 'Images/MM7.webp',
            name: ' Vòng đá Diopside 10mm cao cấp chuẩn 6A',
            price: 5430000,
            discount: 1234567
        },
        {
            img: 'Images/MM8.webp',
            name: 'Vòng Ngọc Cẩm Thạch xanh sơn thủy 10mm',
            price: 959303,
            discount: 2354530
        }
    ]

    /* menh thủy */
    $rootScope.thuy = [
        {
            img: 'Images/MT1.webp',
            name: 'Nhẫn bạc đính đá Thạch Anh chicasa Vàng Citrine 8mm',
            price: 230000,
            discount: 2790000
        },
        {
            img: 'Images/MT2.webp',
            name: 'Ubisa Ngọc Cẩm Thạch xanh sơn thủy 10mm',
            price: 230000,
            discount: 233000
        },
        {
            img: 'Images/MT3.webp',
            name: 'Saiako Vòng đá Diopside 10mm cao cấp chuẩn 6A siêu sao',
            price: 320000,
            discount: 2300000
        },
        {
            img: 'Images/MT4.webp',
            name: 'Vòng Ngọc Cẩm Thạch xanh sơn thủy 10mm đến từ sao hổ',
            price: 20000,
            discount: 30000
        }
    ]

    $rootScope.thuy1 = [
        {
            img: 'Images/MT5.webp',
            name: 'Vòng Hổ Phách mật lạp 17mm bên sông vô bờ',
            price: 2300000,
            discount: 4500000
        },
        {
            img: 'Images/MT6.webp',
            name: 'Cứ lấy từ hán Vòng Ngọc Cẩm Thạch xanh sơn thủy 10mm',
            price: 100,
            discount: 2000
        },
        {
            img: 'Images/MT7.webp',
            name: 'Đến là đón Vòng đá Diopside 10mm cao cấp chuẩn 6A',
            price: 33200,
            discount: 340000
        },
        {
            img: 'Images/MT8.webp',
            name: 'Vòng không lòng vòng Ngọc Cẩm Thạch xanh sơn thủy 10mm',
            price: 12000,
            discount: 199999
        }
    ]

    /* menh HỎA */
    $rootScope.hoa = [
        {
            img: 'Images/MH1.webp',
            name: 'Nhẫn bạc đính đá chơi thì quất Thạch Anh Vàng Citrine 8mm',
            price: 120000,
            discount: 790000
        },
        {
            img: 'Images/MH2.webp',
            name: 'Vòng cảm từ hán Cẩm Thạch xanh sơn thủy 10mm',
            price: 239999,
            discount: 299999
        },
        {
            img: 'Images/MH3.webp',
            name: ' Vòng hết nước đá Diopside 10mm cao cấp chuẩn 6A',
            price: 540000,
            discount: 790000
        },
        {
            img: 'Images/MH4.webp',
            name: 'Vòng Ngọc Cẩm Thạch xanh sơn thủy 10mm lịm từ bãi rác',
            price: 990000,
            discount: 1999000
        }
    ]

    $rootScope.hoa1 = [
        {
            img: 'Images/MH5.webp',
            name: 'Vòng Hổ Phách mật lạp 17mm',
            price: 540000,
            discount: 790000
        },
        {
            img: 'Images/MH6.webp',
            name: 'Vòng Ngọc Cẩm Thạch xanh sơn thủy 10mm',
            price: 990000,
            discount: 1999000
        },
        {
            img: 'Images/MH7.webp',
            name: ' Vòng đá Diopside 10mm cao cấp chuẩn 6A',
            price: 540000,
            discount: 790000
        },
        {
            img: 'Images/MH8.webp',
            name: 'Vòng Ngọc Cẩm Thạch xanh sơn thủy 10mm',
            price: 990000,
            discount: 1999000
        }
    ]

    /* menh THỔ */
    $rootScope.tho = [
        {
            img: 'Images/T1.webp',
            name: 'Nhẫn tím đính đá Thạch Anh Vàng Citrine 8mm malaysia',
            price: 40000,
            discount: 90000
        },
        {
            img: 'Images/T2.webp',
            name: 'Vòng nâu đổ Cẩm Thạch xanh sơn thủy 10mm',
            price: 90000,
            discount: 99000
        },
        {
            img: 'Images/T3.webp',
            name: 'macaru đá Diopside 10mm cao cấp chuẩn 6A',
            price: 50000,
            discount: 70000
        },
        {
            img: 'Images/T4.webp',
            name: 'obita Vòng Ngọc Cẩm Thạch xanh sơn thủy 10mm',
            price: 10000,
            discount: 189000
        }
    ]

    $rootScope.tho1 = [
        {
            img: 'Images/T5.webp',
            name: 'mack Vòng Hổ Phách mật lạp 17mm',
            price: 450,
            discount: 980
        },
        {
            img: 'Images/T6.webp',
            name: 'Vòng Ngọc Cẩm Thạch xanh sơn thủy 10mm đến từ ác quỷ',
            price: 490,
            discount: 1000
        },
        {
            img: 'Images/T7.webp',
            name: ' Vòng đá Diopside 10mm cao cấp chuẩn 6A siêu sao',
            price: 34000,
            discount: 3200000
        },
        {
            img: 'Images/T8.webp',
            name: 'Vòng Ngọc Cẩm Thạch đến ngay luôn xanh sơn thủy 10mm',
            price: 990000,
            discount: 1999000
        },
        {
            img: 'Images/T1.webp',
            name: 'Nhẫn tím đính đá Thạch Anh Vàng Citrine 8mm malaysia',
            price: 40000,
            discount: 90000
        },
        {
            img: 'Images/T2.webp',
            name: 'Vòng nâu đổ Cẩm Thạch xanh sơn thủy 10mm',
            price: 90000,
            discount: 99000
        },
        {
            img: 'Images/T3.webp',
            name: 'macaru đá Diopside 10mm cao cấp chuẩn 6A',
            price: 50000,
            discount: 70000
        },
        {
            img: 'Images/T4.webp',
            name: 'obita Vòng Ngọc Cẩm Thạch xanh sơn thủy 10mm',
            price: 10000,
            discount: 189000
        }
    ]

    $rootScope.timKiem = [
        {
            id: 1,
            img: 'Images/MT5.webp',
            name: 'Vòng Hổ Phách mật lạp 17mm bên sông vô bờ',
            price: 2300000,
            discount: 4500000
        },
        {
            id: 2,
            img: 'Images/MT6.webp',
            name: 'Cứ lấy từ hán Vòng Ngọc Cẩm Thạch xanh sơn thủy 10mm',
            price: 100,
            discount: 2000
        },
        {
            id: 3,
            img: 'Images/MT7.webp',
            name: 'Đến là đón Vòng đá Diopside 10mm cao cấp chuẩn 6A',
            price: 33200,
            discount: 340000
        },
        {
            id: 4,
            img: 'Images/MT8.webp',
            name: 'Vòng không lòng vòng Ngọc Cẩm Thạch xanh sơn thủy 10mm',
            price: 12000,
            discount: 199999
        },
        {
            id: 5,
            img: 'Images/MT1.webp',
            name: 'Nhẫn bạc đính đá Thạch Anh chicasa Vàng Citrine 8mm',
            price: 230000,
            discount: 2790000
        },
        {
            id: 6,
            img: 'Images/MT2.webp',
            name: 'Ubisa Ngọc Cẩm Thạch xanh sơn thủy 10mm',
            price: 230000,
            discount: 233000
        },
        {
            id: 7,
            img: 'Images/MT3.webp',
            name: 'Saiako Vòng đá Diopside 10mm cao cấp chuẩn 6A siêu sao',
            price: 320000,
            discount: 2300000
        },
        {
            id: 8,
            img: 'Images/MT4.webp',
            name: 'Vòng Ngọc Cẩm Thạch xanh sơn thủy 10mm đến từ sao hổ',
            price: 20000,
            discount: 30000
        },
        {
            id: 9,
            img: 'Images/5.webp',
            name: 'Vòng Hổ Phách Baltic cognac vàng 18mm',
            price: 174000,
            discount: 2999000
        },
        {
            id: 10,
            img: 'Images/6.webp',
            name: 'Vòng kiềng Ruby Nam Phi cao cấp ni 52',
            price: 3400000,
            discount: 1999000
        },
        {
            id: 11,
            img: 'Images/7.webp',
            name: 'Vòng tay đá Thạch Anh Đen Morion Quartz 10mm cao cấp',
            price: 540000,
            discount: 790000
        },
        {
            id: 12,
            img: 'Images/8.webp',
            name: 'Vòng Ngọc Cẩm Thạch xanh sơn thủy 10mm',
            price: 990000,
            discount: 1999000
        },
        {
            id: 13,
            img: 'Images/MM1.webp',
            name: 'Mặt đá Aquamarine cao cấp chuẩn 8A 17mm',
            price: 140000,
            discount: 790000
        },
        {
            id: 14,
            img: 'Images/MM2.webp',
            name: 'Vòng vàng Cẩm Thạch xanh sơn thủy 10mm',
            price: 9980000,
            discount: 1999000
        },
        {
            id: 15,
            img: 'Images/MM3.webp',
            name: ' Vòng đá Diopside 100mm chuẩn 6A cu lay',
            price: 990000,
            discount: 340000
        },
        {
            id: 16,
            img: 'Images/MM4.webp',
            name: 'Vòng Ngọc Cẩm Thạch  đỏ đô thủy 10mm',
            price: 9790000,
            discount: 19799000
        }


    ]
})

app.config(function ($routeProvider) {
    $routeProvider.when('/home', {
        templateUrl: 'view/home.html'
    }).when('/cart', {
        templateUrl: 'view/cart.html'
    }).when('/signin', {
        templateUrl: 'sign in.html'
    }).when('/signup', {
        templateUrl: 'sign up.html'
    }).when('/addProduct', {
        templateUrl: 'view/jsonserver.html'
    })
        .when('/search', {
            templateUrl: 'view/search.html'
        }).when('/details/:productId', {  // productId là một tham số
            templateUrl: 'detail product.html',
            controller: 'ProductDetailController'  // Tạo controller này
        })
        .otherwise({
            redirectTo: '/home'
        })
})


/* details */
app.controller('ProductDetailController', function ($scope, $routeParams, $rootScope) {
    var productId = $routeParams.productId;
    $scope.selectedProduct = $rootScope.listSp.find(p => p.id == productId);

});


app.run(function ($rootScope) {
    $rootScope.$on("$routeChangeStart", function () {
        $rootScope.loading = true;
    })
    $rootScope.$on("$routeChangeSuccess", function () {
        $rootScope.loading = false;
    })
    $rootScope.$on("$routeChangeError", function () {
        $rootScope.loading = false;
        alert('Loi roi thang quy nho');
    })
})



