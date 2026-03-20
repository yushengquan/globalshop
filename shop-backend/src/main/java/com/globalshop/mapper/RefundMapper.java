package com.globalshop.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.globalshop.entity.Refund;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import java.util.List;

@Mapper
public interface RefundMapper extends BaseMapper<Refund> {
    @Select("SELECT * FROM refunds WHERE user_id = #{userId} ORDER BY created_at DESC")
    List<Refund> findByUserId(Long userId);
}
