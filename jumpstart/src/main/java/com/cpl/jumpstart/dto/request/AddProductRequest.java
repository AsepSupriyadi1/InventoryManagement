package com.cpl.jumpstart.dto.request;


import com.cpl.jumpstart.entity.ProductCategory;
import com.cpl.jumpstart.entity.Supplier;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AddProductRequest {

    private String productName;

    private String prices;
    private String costs;

    private String weight;
    private String volume;

    private String categoryId;
    private String supplierId;

    private MultipartFile picture;

}
