// Khởi tạo danh sách category
function createCategory() {
    if (localStorage.getItem('defaultCategories') == null) {
        let defaultCategories = [
            'Món mì',
            'Món trộn', 
            'Món lẩu',
            'Món ăn vặt',
            'Nước uống',
            'Tokbokki'
        ];
        localStorage.setItem('defaultCategories', JSON.stringify(defaultCategories));
    }
    // Khởi tạo ID mapping nếu chưa có
    if (localStorage.getItem('categoryIdMapping') == null) {
        let categories = JSON.parse(localStorage.getItem('defaultCategories'));
        let mapping = {};
        categories.forEach((cat, index) => {
            mapping[cat] = 'cat' + index;
        });
        localStorage.setItem('categoryIdMapping', JSON.stringify(mapping));
    }
    // Khởi tạo mapping lợi nhuận cho từng category nếu chưa có
    if (localStorage.getItem('categoryProfitMapping') == null) {
        let categories = JSON.parse(localStorage.getItem('defaultCategories'));
        let categoryIdMapping = JSON.parse(localStorage.getItem('categoryIdMapping'));
        let profitMapping = {};
        categories.forEach((cat, index) => {
            // Mặc định lợi nhuận là 0.25 cho tất cả
            profitMapping[categoryIdMapping[cat]] = 0.25;
        });
        localStorage.setItem('categoryProfitMapping', JSON.stringify(profitMapping));
    }
}

//Khoi tao danh sach san pham
function createProduct() {
    if (localStorage.getItem('products') == null) {
        // Lấy category IDs từ localStorage
        let categoryIdMapping = JSON.parse(localStorage.getItem('categoryIdMapping')) || {};
        let categoryProfitMapping = JSON.parse(localStorage.getItem('categoryProfitMapping')) || {};
        let categories = JSON.parse(localStorage.getItem('defaultCategories')) || ['Món mì', 'Món trộn', 'Món lẩu', 'Món ăn vặt', 'Nước uống', 'Tokbokki'];
        
        // Lấy ID của từng category
        let catMi = categoryIdMapping[categories[0]] || 'cat0';
        let catTron = categoryIdMapping[categories[1]] || 'cat1';
        let catLau = categoryIdMapping[categories[2]] || 'cat2';
        let catAnVat = categoryIdMapping[categories[3]] || 'cat3';
        let catNuoc = categoryIdMapping[categories[4]] || 'cat4';
        let catTokbokki = categoryIdMapping[categories[5]] || 'cat5';
        
        let products = [{
            id: 1,
            status: 1, 
            title: 'Mì kim chi bò',
            img: './assets/img/products/mi-kim-chi-bo-300x225.png',
            category: catMi,
            loinhuan: 0.25,
            soluong: 2000, 
            giagoc: 50000,
            desc: 'Sợi mì tươi của Hàn Quốc kết hợp với những miếng thịt bò Việt Nam và kèm nước dùng kim chi chua ngọt tạo nên tô mì kim chi bò chua chua cay cay.'
        },
        {
            id: 2,
            status: 1, 
            title: 'Mì kim chi đùi gà',
            img: './assets/img/products/mi-kim-chi-dui-ga-300x225.png',
            category: catMi,
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 40000,
            desc: 'Nước dùng kim chi đi cùng với thịt gà mềm chắc và kết hợp với các loại rau mùi giúp làm ra một tô mì kim chi gà thơm cay.'
        },
        {
            id: 3,
            status: 1, 
            title: 'Mì kim chi sườn sụn',
            img: './assets/img/products/mkc-ss.png',
            category: catMi,
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 45000,
            desc: 'Sợi mì giòn dai của Hàn Quốc kết hợp với những lát sườn mỏng mềm và ăn kèm các loại topping khác khiến cho tô mì kim chi sườn sụn trở nên bắt mắt.'
        },
        {
            id: 4,
            status: 1,
            title: 'Mì kim chi cá',
            img: './assets/img/products/mkcc.png',
            category: catMi,
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 45000,
            desc: 'Những miếng cá basa có mỡ mềm mọng nước và đi với đó là nước dùng kim chi chua cay làm cho tô mì kim chi cá trở nên béo ngậy.'
        },
        {
            id: 5,
            status: 1, 
            title: 'Mì kim chi bạch tuột',
            img: './assets/img/products/mkc-bachtuot.png',
            category: catMi,
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 50000,
            desc: 'Những sợi râu bạch tuột chắc nịt đi kèm sợi mì giòn dai đến từ xứ sở kim chi ăn cùng bắp cải thảo kim chi làm cho tô mì kim chi bạch tuột vô cùng cuốn hút.'
        },

        {
            id: 6,
            status: 1, 
            title: 'Mì kim chi hải sản',
            img: './assets/img/products/mlths.png',
            category: catMi,
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 45000,
            desc: 'Những sợi mì dai hòa quyện cùng vị chua cay đậm đà của kim chi, kết hợp hải sản tươi ngọt như tôm, mực hòa cùng vị cay nồng đặc trưng, tạo cảm giác vừa lạ miệng vừa hấp dẫn..'
        },

        {
            id: 7,
            status: 1, 
            title: 'Mì kim chi Thập cẩm',
            category: catMi,
            img: './assets/img/products/mkctc.png',
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 40000,
            desc: 'Tai heo được cuộn bên trong cùng phần thịt lưỡi heo. Phần tai bên ngoài giòn dai, phần thịt lưỡi bên trong vẫn mềm, có độ ngọt tự nhiên của thịt. Tai cuộn lưỡi được chấm với nước mắm và tiêu đen.'
        },

        {
            id: 8,
            status: 1, 
            title: 'Mì kim chi Xúc Xích Trứng',
            img: './assets/img/products/mkcxx.png',
            category: catMi,
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 50000,
            desc: 'Sợi mì vàng óng quyện trong vị kim chi cay nhẹ, điểm thêm lát xúc xích béo thơm và trứng lòng đào béo mịn hòa quyện giữa cay, béo và chua nhẹ, kích thích vị giác ngay từ miếng đầu tiên..'
        },
//=================================================DRINK==================================
        {
            id: 9,
            status: 1, 
            title: 'Trà Ổi Hồng',
            category: catNuoc,
            img: './assets/img/products/toh.png',
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 25000,
            desc: 'Món Nước uống vừa béo ngậy, chua ngọt đủ cả mà vẫn có vị thanh của trà.',
        },
        {
            id: 10,
            status: 1, 
            title: 'Trà đào chanh sả',
            category: catNuoc,
            img: './assets/img/products/tra-dao-chanh-sa.jpg',
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 20000,
            desc: 'Trà đào chanh sả có vị đậm ngọt thanh của đào, vị chua chua dịu nhẹ của chanh và hương thơm của sả.',
        },
        {
            id: 11,
            status: 1, 
            title: 'Hồng Trà dâu',
            category: catNuoc,
            img: './assets/img/products/htd.png',
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 23000,
            desc: 'Vị chát nhẹ của hồng trà hòa cùng hương dâu ngọt dịu, mang cảm giác tươi mát và quyến rũ tạo sự kết hợp hài hòa giữa vị trà và hương dâu thơm nồng nàn..'
        },
        {
            id: 12,
            status: 1, 
            title: 'Trà sữa truyền thống',
            img: './assets/img/products/ts.png',
            category: catNuoc,
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 25000,
            desc: 'Vị trà đậm đà hòa quyện cùng sữa béo ngọt, tạo nên hương vị quen thuộc nhưng luôn cuốn hút. Thức uống mang lại cảm giác ấm áp, dễ chịu sau mỗi lần thưởng thức.'
        },
        {
            id: 13,
            status: 1, 
            title: 'Trà sữa Thái',
            img: './assets/img/products/tst.png',
            category: catNuoc,
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 23000,
            desc: 'Màu xanh đặc trưng cùng hương thơm nồng nàn, trà sữa Thái mang vị ngọt béo pha chút chát nhẹ tinh tế. Mỗi ly là một trải nghiệm vừa đậm đà vừa tươi mới khó quên..'
        },
        {
            id: 14,
            status: 1, 
            title: 'Trà Chanh',
            img: './assets/img/products/tc.png',
            category: catNuoc,
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 20000,
            desc: 'Vị chua thanh của chanh hòa cùng hương trà mát lạnh, tạo nên thức uống giải khát tuyệt vời cho những ngày oi bức. Hậu vị chua nhẹ xen lẫn ngọt dịu khiến người thưởng thức sảng khoái tức thì.'
        },
        {
            id: 15,
            status: 1, 
            title: 'Yogurt Xoài',
            img: './assets/img/products/yxoai.png',
            category: catNuoc,
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 10000,
            desc: 'Yogurt mát lạnh kết hợp với mứt xoài ngọt thơm lừng, ngọt béo hài hòa. Mỗi ngụm mang trọn hương vị nhiệt đới, vừa sảng khoái vừa đầy năng lượng.'
        },
        {
            id: 16,
            status: 1, 
            title: 'Yogurt dâu',
            img: './assets/img/products/ydau.png',
            category: catNuoc,
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 10000,
            desc: 'Vị chua nhẹ của sữa chua hòa quyện cùng hương dâu ngọt ngào, mang lại cảm giác tươi mát và dễ chịu. Màu hồng nhạt bắt mắt cùng vị béo thanh khiến món uống trở nên vô cùng hấp dẫn.'
        },
        {
            id: 17,
            status: 1, 
            title: 'Yogurt Việt quất',
            img: './assets/img/products/yv.png',
            category: catNuoc,
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 10000,
            desc: 'Hương việt quất chua thanh hòa cùng độ béo mịn của sữa chua, tạo nên vị ngon độc đáo và quyến rũ. Màu tím tự nhiên cùng vị mát lạnh khiến món uống trở nên nổi bật và tinh tế.'
        },
        {
            id: 18,
            status: 1, 
            title: 'Yogurt đá',
            img: './assets/img/products/yda.png',
            category: catNuoc,
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 15000,
            desc: 'Sữa chua được lắc cùng đá lạnh, tạo nên kết cấu mịn mát và vị chua ngọt mang lại cảm giác sảng khoái tức thì trong những ngày nắng nóng.'
        },
        //-------------------------------------------------------------------------MON TRON
        {
            id: 19,
            status: 1, 
            title: 'Mì trộn Bò',
            img: './assets/img/products/mtb.png',
            category: catTron,
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 40000,
            desc: 'Sợi mì dai mềm thấm đều nước sốt đậm đà, hòa quyện cùng thịt bò thơm ngọt. Mùi hành phi và mè rang dậy hương hấp dẫn từ hương đến vị. '
        },
        {
            id: 20,
            status: 1, 
            title: 'Mì trộn hải sản ',
            img: './assets/img/products/mths.png',
            category: catTron,
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 35000,
            desc: 'Mì trộn cay nhẹ kết hợp với tôm, mực, nghêu tươi ngon. Nước sốt đậm vị biển, thơm nồng và hài hòa.'
        },
        {
            id: 21,
            status: 1, 
            title: 'Mì trộn thập cẩm',
            category: catTron,
            img: './assets/img/products/mttc.png',
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 30000,
            desc: 'Hòa quyện giữa bò, hải sản và rau trộn trong lớp sốt cay ngọt đậm đà. Sợi mì dai, thấm vị, ăn kèm topping phong phú.'
        },
        {
            id: 22,
            status: 1, 
            title: 'Cơm trộn Bò',
            category: catTron,
            img: './assets/img/products/bbb.png',
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 37000,
            desc: 'Cơm trắng nóng hổi ăn cùng thịt bò xào thơm và rau củ tươi. Khi trộn đều với nước sốt gochujang cay ngọt, hương vị hòa quyện tuyệt vời.'
        },

        {
            id: 23,
            status: 1, 
            title: 'Cơm trộn truyền thống',
            category: catTron,
            img: './assets/img/products/bb.png',
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 45000,
            desc: 'Cơm, trứng, rau củ và nước sốt gochujang tạo nên hương vị chuẩn Hàn. Mỗi thìa cơm là sự hòa quyện của vị cay, ngọt, và thơm béo.'
        },

        {
            id: 24,
            status: 1, 
            title: 'Cơm trộn Bulgogi',
            img: './assets/img/products/bulgogi.png',
            category: catTron,
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 40000,
            desc: 'Cơm trộn cùng thịt bò bulgogi được ướp ngọt thanh và nướng thơm lừng. Nước sốt đặc trưng thấm đều, tạo vị béo nhẹ và đậm đà.'
        },
        //-----------------------------------------------------
        //==================================================== DO AN VAT
        {
            id: 25,
            status: 1, 
            title: 'Gà cay phô mai',
            img: './assets/img/products/gcpm.png',
            category: catAnVat,
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 60000,
            desc: 'Thịt gà mềm thấm sốt cay nồng, phủ lớp phô mai tan chảy béo ngậy. Khi kéo phô mai lên, hương thơm lan tỏa khiến ai cũng gây nghiện'
        },

        {
            id: 26,
            status: 1, 
            title: 'Gà cuộn rong biển',
            category: catAnVat,
            img: './assets/img/products/gcrb.png',
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 65000,
            desc: 'Thịt gà được cuộn khéo léo cùng rong biển, chiên vàng giòn rụm. Lớp ngoài giòn tan, bên trong mềm thơm đậm đà.'
        },

        {
            id: 27,
            status: 1, 
            title: 'Gà rán truyền thống',
            category: catAnVat,
            img: './assets/img/products/garan.png',
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 70000,
            desc: 'Miếng gà rán vàng óng, giòn rụm bên ngoài, mềm ngọt bên trong. Lớp da giòn tan hòa cùng vị mặn mà vừa miệng.'
        },

        {
            id: 28,
            status: 1, 
            title: 'kimbap',
            category: catAnVat,
            img: './assets/img/products/kimbap.png',
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 20000,
            desc: 'Cơm cuộn rong biển chuẩn vị Hàn, đầy ắp trứng, chả cá, rau củ và xúc xích. Mỗi lát kimbap là sự hòa quyện giữa dẻo, giòn, và thơm béo.'
        },

        {
            id: 29,
            status: 1, 
            title: 'Bánh xếp Hàn Quốc',
            category: catAnVat,
            img: './assets/img/products/mandu.png',
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 30000,
            desc: 'Nhân thịt và rau được gói khéo léo trong lớp vỏ mỏng, chiên vàng giòn hoặc hấp mềm. Khi cắn vào, vị ngọt thơm lan tỏa trong miệng.'
        },

        {
            id: 30,
            status: 1, 
            title: 'Bánh takoyaki',
            category: catAnVat,
            img: './assets/img/products/tako.png',
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 30000,
            desc: 'Viên bánh tròn mềm nóng hổi, nhân bạch tuộc tươi dai giòn hấp dẫn. Phủ lên là sốt mayonnaise, tương takoyaki và cá bào thơm lừng.'
        },

        {
            id: 31,
            status: 1, 
            title: 'Bánh phô mai Ho-teok',
            category: catAnVat,
            img: './assets/img/products/hoteok.png',
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 30000,
            desc: 'Bánh pancake Hàn Quốc nhân đường nâu, dẻo thơm và ngọt dịu. Khi cắn vào, nhân chảy tan hòa cùng mùi quế béo bùi.'
        },
        {
            id: 32,
            status: 1, 
            title: 'Bánh sữa tươi chiên',
            category: catAnVat,
            img: './assets/img/products/bst.jpg',
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 30000,
            desc: 'Lớp bánh mềm mịn, thơm nhẹ mùi sữa tươi, vỏ bánh bên ngoài giòn. Có vị ngọt thanh và béo từ bên trong.'
        },

        {
            id: 33,
            status: 1, 
            title: 'Há cảo chiên',
            category: catAnVat,
            img: './assets/img/products/hcc.jpg',
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 30000,
            desc: 'Vỏ bánh vàng giòn, nhân thịt và rau hòa quyện đậm đà. Khi cắn vào, lớp vỏ giòn tan đối lập với phần nhân mềm nóng hổi.'
        },

        {
            id: 34,
            status: 1, 
            title: 'Phô mai que',
            category: catAnVat,
            img: './assets/img/products/pmq.png',
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 30000,
            desc: 'Que phô mai giòn rụm bên ngoài, kéo dài béo ngậy bên trong. Mỗi miếng cắn là sự kết hợp hoàn hảo giữa giòn và tan chảy.'
        },

        {
            id: 35,
            status: 1, 
            title: 'Xúc xich chiên',
            category: catAnVat,
            img: './assets/img/products/xxc.jpg',
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 30000,
            desc: 'Xúc xích vàng ươm, giòn bên ngoài, mềm mọng nước bên trong. Khi chấm cùng tương ớt hay tương cà, vị ngon càng thêm trọn vẹn.'
        },

        {
            id: 36,
            status: 1, 
            title: 'Khoai tây chiên',
            category: catAnVat,
            img: './assets/img/products/ktc.jpg',
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 30000,
            desc: 'Khoai tây cắt sợi chiên vàng giòn, thơm nức mũi. Mỗi miếng khoai nóng hổi giòn ngoài mềm trong, chấm cùng tương ớt càng ngon.'
        },

        {
            id: 37,
            status: 1, 
            title: 'Bánh đậu hủ phô mai',
            category: catAnVat,
            img: './assets/img/products/dhpm.png',
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 25000,
            desc: 'Miếng đậu hủ chiên giòn vàng, nhân phô mai tan chảy béo ngậy. Khi cắn vào, vị mặn mà và béo dịu hòa quyện hoàn hảo.'
        },
        //======================================================
        //-----------------------------------------------LẨU------------------------------------MON LAU
        {
            id: 42,
            status: 1, 
            title: 'lẩu Kim Chi Bò',
            category: catLau,
            img: './assets/img/products/lb.jpg',
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 250000,
            desc: 'Lẩu kim chi bò là sự kết hợp giữa vị chua nhẹ của kim chi, vị ngọt thanh từ xương hầm và hương thơm béo ngậy của thịt bò',
        },
        {
            id: 43,
            status: 1, 
            title: 'Lẩu kim chi Hải sản',
            category: catLau,
            img: './assets/img/products/lkchs.jpg',
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 260000,
            desc: 'Lẩu kim chi hải sản là sự giao hòa của từng miếng hải sản giòn ngọt, thấm đậm vị kim chi cay cay, chua chua của kim chi nóng hổi.',
        },
        {
            id: 44,
            status: 1, 
            title: 'Lẩu Thập cẩm',
            category: catLau,
            img: './assets/img/products/ltc.jpg',
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 240000,
            desc: 'Lẩu thập cẩm là món ăn hội tụ tinh hoa của nhiều nguyên liệu, mang đến hương vị phong phú và hấp dẫn bậc nhất, vị ngọt mềm của thịt, độ giòn của tôm mực, vị thanh mát của rau củ.',
        },

        //---------------------------------------------------------------
        //TOKBOKKI-------------------------------------------------------
        {
            id: 56,
            status: 1, 
            title: 'Tokbokki lắc phô mai',
            category: catTokbokki,
            img: './assets/img/products/toklpm.png',
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 50000,
            desc: 'Bánh gạo dẻo dai phủ lớp phô mai béo ngậy thơm lừng. Khi lắc, phô mai ôm trọn từng miếng bánh tạo vị mặn mà hấp dẫn.',
        },
        {
            id: 57,
            status: 1, 
            title: 'Tokbokki Truyền thống',
            category: catTokbokki,
            img: './assets/img/products/tokth.png',
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 50000,
            desc: 'Món ăn đặc trưng xứ Hàn với nước sốt gochujang cay nồng và ngọt nhẹ. Bánh gạo mềm dai, quyện đều trong lớp sốt đỏ hấp dẫn.',
        },
        {
            id: 58,
            status: 1, 
            title: 'Tokbokki Bò',
            category: catTokbokki,
            img: './assets/img/products/tokbo.png',
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 50000,
            desc: 'Bánh gạo dẻo mềm hòa quyện cùng thịt bò thơm ngọt. Nước sốt cay ngọt đậm đà thấm đều từng miếng bánh. Cay nhẹ khiến ai ăn cũng mê.'
        },
        {
            id: 59,
            status: 1, 
            title: 'Tokbokki Hải Sản',
            img: './assets/img/products/tokhs.png',
            category: catTokbokki,
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 50000,
            desc: 'Bánh gạo mềm dẻo quyện cùng vị ngọt tươi của tôm, mực và nghêu. Nước sốt cay nồng đặc trưng làm dậy hương biển.'
        },
        {
            id: 60,
            status: 1, 
            title: 'Tokbokki Thập Cẩm',
            img: './assets/img/products/toktc.png',
            category: catTokbokki,
            loinhuan: 0.25,
            soluong: 1000, 
            giagoc: 50000,
            desc: 'Sự kết hợp hoàn hảo của bò, xúc xích, trứng và hải sản trong lớp sốt đỏ au. Bánh gạo dẻo thơm thấm đẫm vị cay ngọt.'
        },
        ]
        // Cập nhật lợi nhuận cho từng sản phẩm theo categoryProfitMapping
        products.forEach(p => {
            // Nếu có lợi nhuận cho category thì lấy, không thì mặc định 0.25
            let profit = categoryProfitMapping[p.category] !== undefined ? categoryProfitMapping[p.category] : 0.25;
            p.loinhuan = profit;
            let rawPrice = p.giagoc + p.giagoc * profit;
            p.price = Math.round(rawPrice / 1000) * 1000;
            p.tienLai = p.price - p.giagoc;
        });
        localStorage.setItem('products', JSON.stringify(products));
    }
}


// Create admin account 
function createAdminAccount() {
    let accounts = localStorage.getItem("accounts");
    if (!accounts) {
        accounts = [];
        accounts.push({
            fullname: "Trương Công Danh",
            phone: "0123456789",
            password: "123456",
            address: '',
            email: '',
            status: 1,
            join: new Date(),
            cart: [],
            userType: 1
        })
        localStorage.setItem('accounts', JSON.stringify(accounts));
    }
}

// Khi cập nhật lợi nhuận của category, cập nhật lại lợi nhuận cho tất cả sản phẩm thuộc category đó
function updateProfitForCategory(categoryId, newProfit) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products.forEach(product => {
        if (product.category === categoryId) {
            product.loinhuan = parseFloat(newProfit);
            let rawPrice = product.giagoc + product.giagoc * product.loinhuan;
            product.price = Math.round(rawPrice / 1000) * 1000;
            product.tienLai = product.price - product.giagoc;
        }
    });
    localStorage.setItem('products', JSON.stringify(products));
}

// Khởi tạo phiếu nhập hàng
function createPhieuNhap() {
    if (localStorage.getItem('phieuNhap') == null) {
        let phieuNhap = [];
        localStorage.setItem('phieuNhap', JSON.stringify(phieuNhap));
    }
}

window.onload = createCategory();
window.onload = createProduct();
window.onload = createAdminAccount();