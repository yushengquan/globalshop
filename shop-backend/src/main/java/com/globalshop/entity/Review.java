package com.globalshop.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("reviews")
public class Review {
    @TableId(type = IdType.ASSIGN_ID)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long id;

    @JsonSerialize(using = ToStringSerializer.class)
    private Long productId;

    @JsonSerialize(using = ToStringSerializer.class)
    private Long userId;

    private String userName;
    private Integer rating; // 1-5
    private String title;
    private String content;
    private String reply;
    private Integer status; // 0=待审核 1=已发布 2=已拒绝

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
